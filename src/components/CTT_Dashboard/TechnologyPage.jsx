import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Container,
  Box,
  Card,
  Typography,
  styled,
  MenuItem,
  Select,
  FormControl
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import {
  ResponsiveContainer,
  Tooltip,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";
import { FaArrowRight } from "react-icons/fa";
import CTTHeader from "./CTT_Header";
import PieGraph from "./PieGraph";
// import PopulationChart from "./PopulationChart";
import ComparisonPublications from "./ComparisonPublications";
import PatentActivity from "./PatentActivity";
import axios from "axios";
import MultiLinePublicationGraph from "./MultiLinePublicationGraph";

const DashboardCard = styled(Card)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  height: "260px",
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[2],
  transition: "box-shadow 0.3s ease",
  "&:hover": { boxShadow: theme.shadows[4] },
}));

const LargeDashboardCard = styled(Card)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  // marginTop: theme.spacing(2),
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[2],
}));

const StatCardContent = styled(Box)({
  display: "flex",
  alignItems: "center",
  flexGrow: 1,
});

const RatioCardContent = styled(Box)({
  display: "flex",
  height: "100%",
});

const LeftContent = styled(Box)({
  display: "flex",
  flexDirection: "column",
  width: "40%",
  justifyContent: "space-between",
});

const ChartWrapper = styled(Box)({
  width: "60%",
  height: "100%",
  minHeight: "150px",
});

const HeaderRow = styled(Box)({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  width: "100%",
  marginBottom: "16px",
});

const DropdownContainer = styled(Box)({
  display: "flex",
  gap: "16px",
});

const TechnologyPage = () => {
  const navigate = useNavigate();
  const { sub_tech_id } = useParams();
  const [subTech, setSubTech] = useState(null);
  const [loading, setLoading] = useState(true);
  const [globalCountry, setGlobalCountry] = useState(0);
  const [counts, setCounts] = useState(null); 
  const [chartData, setChartData] = useState([]);
  const [patentCounts, setPatentCounts] = useState(null);
  const [pubPie, setPubPie] = useState(null);



  const countries = [
  { id: 0, name: "Global" },
  { id: 1, name: "India" },
  { id: 2, name: "China" },
  { id: 3, name: "United States" },
  { id: 4, name: "United Kingdom" },
  { id: 5, name: "Australia" }
];

  useEffect(() => {
    fetch("https://development.stieahub.in/Codigniter_api/public/get_sub_techlogies")
      .then((res) => res.json())
      .then((data) => {
        let foundSubTech = null;
        data.forEach((tech) => {
          const sub = tech.sub_techs?.find(
            (s) => String(s.sub_tech_id) === String(sub_tech_id)
          );
          if (sub) foundSubTech = sub;
        });
        setSubTech(foundSubTech);
        setLoading(false);
      })
      .catch((err) => {
        console.error(" Error fetching sub-technology:", err);
        setLoading(false);
      });
  }, [sub_tech_id]);

  useEffect(() => {
    fetch("https://development.stieahub.in/Codigniter_api/public/get_global_publication_count")
      .then((res) => res.json())
      .then((data) => {
        const match = data.find(
          (item) => String(item.sub_tech_id) === String(sub_tech_id)
        );
        if (match) setCounts(match);
      })
      .catch((err) =>
        console.error(" Error fetching publication counts:", err)
      );
  }, [sub_tech_id]);

  useEffect(() => {
  fetch("https://development.stieahub.in/Codigniter_api/public/get_global_patent_count")
    .then((res) => res.json())
    .then((data) => {
      const match = data.find(
        (item) => String(item.sub_tech_id) === String(sub_tech_id)
      );
      if (match) setPatentCounts(match);
    })
    .catch((err) =>
      console.error(" Error fetching patent counts:", err)
    );
}, [sub_tech_id]);


useEffect(() => {
  fetch("https://development.stieahub.in/Codigniter_api/public/get_global_publication_piedata")
    .then((res) => res.json())
    .then((data) => {
      if (String(data.sub_tech_id) === String(sub_tech_id)) {
        setPubPie(data);
      }
    })
    .catch((err) => console.error("Error fetching publication pie data:", err));
}, [sub_tech_id]);



  useEffect(() => {
  const loadTrendData = async () => {
    try {
      const res = await axios.get(
        "https://development.stieahub.in/Codigniter_api/public/get_global_publication_trenddata"
      );

      const id = parseInt(sub_tech_id, 10);

      // Filter records for this sub_tech
      const filtered = res.data.filter(
        (item) => parseInt(item.sub_tech_id, 10) === id
      );

      // Format for Recharts
      const formatted = filtered.map((row) => ({
        year: row.year,
        Publications: Number(row.total_publications),
        Patents: Number(row.patent_count),
      }));

      setChartData(formatted);
    } catch (err) {
      console.error("Error loading trend data:", err);
    }
  };

  loadTrendData();
}, [sub_tech_id]);


  const handleGlobalCountryChange = (event) => {
      setGlobalCountry(event.target.value);
    };


  if (loading)
    return (
      <Container sx={{ mt: 10 }}>
        <Typography align="center">Loading...</Typography>
      </Container>
    );

  if (!subTech)
    return (
      <Container sx={{ mt: 10 }}>
        <Typography align="center" color="error">
          No sub-technology found for ID: {sub_tech_id}
        </Typography>
      </Container>
    );

  const totalPublications = Number(counts?.total_publications || 0);
  const totalPatents = Number(patentCounts?.total_patents || 0);
  const total = totalPublications + totalPatents;
  const pubRatio = total ? ((totalPublications / total) * 100).toFixed(1) : 0;
  const patRatio = total ? ((totalPatents / total) * 100).toFixed(1) : 0;

  const cardData = [
    {
      title: "Publications",
      count: totalPublications,
      image:
        "https://development.stieahub.in/Codigniter_api/public/assets/images/CTT/Publications.jpeg",
      url: `/ctt_dashboard/Publications/${sub_tech_id}`,
    },
    {
      title: "Patent Records",
      count: totalPatents,
      image:
        "https://development.stieahub.in/Codigniter_api/public/assets/images/CTT/Patents.jpeg",
      url: `/ctt_dashboard/Patents/${sub_tech_id}`,

    },
  ];

  const pieData = [
    { name: "Publications", value: pubRatio, color: "#0088FE" },
    { name: "Patent Records", value: patRatio, color: "#FF8042" },
  ];

  const pubPieData = pubPie
  ? [
      {
        name: "Top 1 Country",
        value: Number(pubPie.top_1_publication_count),
        color: "#0088FE",
      },
      {
        name: "Top 10 Countries",
        value: Number(pubPie.top_10_publication_count),
        color: "#00C49F",
      },
      {
        name: "Rest of World",
        value:Number(pubPie.total_publications),
        color: "#FFBB28",
      },
    ]
  : null;   // IMPORTANT: not []



  const renderStatCard = (data) => (
    <DashboardCard>
      <StatCardContent>
        <Box
          component="img"
          sx={{ width: 90, height: 90, mr: 2 }}
          src={data.image}
          alt={data.title}
        />
        <Box>
          <Typography variant="h6" color="primary" fontWeight="bold">
            {data.title}
          </Typography>
          <Typography variant="h4" fontWeight="bold">
            {data.count.toLocaleString()}
          </Typography>
        </Box>
      </StatCardContent>
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          mt: 1,
          cursor: "pointer",
        }}
        onClick={() => navigate(data.url)}
      >
        <FaArrowRight />
      </Box>
    </DashboardCard>
  );

  return (
    <div>
      <CTTHeader />
      <Container maxWidth="xl" sx={{ mt: 4 }}>
        <HeaderRow>
          <Typography variant="h4" fontWeight="bold">
            {subTech.sub_tech_name}
          </Typography>

          <DropdownContainer>
            <FormControl sx={{ minWidth: 180 }} size="small" variant="outlined">
                <Select
                  value={globalCountry}
                  onChange={handleGlobalCountryChange}
                  displayEmpty
                >
                  {countries.map((c) => (
                    <MenuItem key={c.id} value={c.id}>
                      {c.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
          </DropdownContainer>
        </HeaderRow>

        <Grid container spacing={3} alignItems="stretch">
          <Grid xs={12} sm={6} md={3}>
            {renderStatCard(cardData[0])}
          </Grid>
          <Grid xs={12} sm={6} md={3}>
            {renderStatCard(cardData[1])}
          </Grid>
          {/* <Grid xs={12} sm={6} md={3}>
            <DashboardCard>
              <RatioCardContent>
                <LeftContent>
                  <Typography variant="h6" color="primary" fontWeight="bold">
                    Publications
                  </Typography>
                </LeftContent>
                <ChartWrapper>
                  <PieGraph chartData={pubPieData} />
                </ChartWrapper>
              </RatioCardContent>
            </DashboardCard>
          </Grid> */}

          {/* <Grid xs={6} md={6}>
            <DashboardCard>
              <RatioCardContent>
                <LeftContent>
                  <Typography variant="h6" color="primary" fontWeight="bold">
                     Patent
                  </Typography>
                </LeftContent>
                <ChartWrapper>
                  <PieGraph chartData={pieData} />
                </ChartWrapper>
              </RatioCardContent>
            </DashboardCard>
          </Grid> */}


        </Grid>

        <LargeDashboardCard>
        <Box
          sx={{
            padding: 2,
            backgroundColor: "aliceblue",
            borderRadius: 2,
            mt: 3,
          }}
        >
          <Typography variant="h6" gutterBottom>
            Description
          </Typography>
          <Typography variant="body">
            {subTech.description ||
              "Description not available for this sub-technology."}
          </Typography>
        </Box>
        </LargeDashboardCard>

        <LargeDashboardCard>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Publications and Patents Trend (2003–2024)
          </Typography>

          <ResponsiveContainer width="100%" height={350}>
            <LineChart
              data={chartData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip />
              <Legend />

              <Line
                type="monotone"
                dataKey="Publications"
                stroke="#0088FE"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="Patents"
                stroke="#FF8042"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </LargeDashboardCard>

        <LargeDashboardCard>
              <h6>Title</h6>
              <p>Description</p>
              <MultiLinePublicationGraph />
        </LargeDashboardCard>

        <LargeDashboardCard>
              <h6>Title</h6>
              <p>Description</p>
              <ComparisonPublications />
        </LargeDashboardCard>
        <LargeDashboardCard>
          <h6>Title</h6>
              <p>Description</p>
              <PatentActivity />
        </LargeDashboardCard>
        
      </Container>
    </div>
  );
};

export default TechnologyPage;


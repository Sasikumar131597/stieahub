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
  FormControl,
} from "@mui/material";
import { FaArrowTrendUp, FaArrowRight } from "react-icons/fa6";
import CTTHeader from "./CTT_Header";
import ComparisonPublications from "./ComparisonPublications";
import PatentActivity from "./PatentActivity";
import MultiLinePublicationGraph from "./MultiLinePublicationGraph";

/* ─── Styled Wrappers ─────────────────────────────────────── */

const PageWrapper = styled(Box)({
  marginTop: "10px",
  padding: "5vh",
});

const HeaderRow = styled(Box)({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  width: "100%",
  marginTop: "45px",
  marginBottom: "16px",
});

const DescriptionCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: "16px",
  boxShadow: "none",
  background: "#f8f9fb",
  marginBottom: theme.spacing(3),
}));

const LargeDashboardCard = styled(Card)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  padding: theme.spacing(2.5),
  borderRadius: "16px",
  boxShadow: theme.shadows[2],
  marginBottom: theme.spacing(3),
}));

/* ─── Card Themes ─────────────────────────────────────────── */

/* ─── Card Themes ─────────────────────────────────────────── */
// Removed background colors, kept accent colors for text/icons/borders
const CARD_THEMES = [
  {
    accent: "#000000",
    label: "Total Publications",
    badge: "Global",
    navigable: true,
  },
  {
    accent: "#000000",
    label: "Patent Records",
    badge: "Global",
    navigable: true,
  },
  {
    accent: "#000000",
    label: "Total Publications",
    badge: "India",
    navigable: false,
  },
  {
    accent: "#000000",
    label: "Patent Records",
    badge: "India",
    navigable: false,
  },
];

/* ─── Stat Card ───────────────────────────────────────────── */
const StatCard = ({ data, theme, onClick }) => {
  const { accent, label, badge, navigable } = theme;

  return (
    <Box
      onClick={navigable ? onClick : undefined}
      sx={{
        background: "#ffffff",
        borderRadius: "20px",
        padding: "28px 28px 24px",
        cursor: navigable ? "pointer" : "default",
        transition: "transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease",
        // Enhanced shadow for prominence + subtle accent border
        // boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
        boxShadow: "7px 12px 23px rgba(12, 10, 10, 0.10)",
        border: "2px solid transparent",
        // borderTop: `4px solid ${accent}`, // Accent top border for visual highlight
        width: "100%",
        minHeight: "200px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        boxSizing: "border-box",
        "&:hover": navigable
          ? { 
              transform: "translateY(-4px)", 
              boxShadow: "0 12px 32px rgba(0,0,0,0.12)",
              borderColor: `${accent}40`, // Subtle accent border on hover
            }
          : {},
      }}
    >
      {/* Top section */}
      <Box>
        {/* Label + Icon on same row, clearly spaced */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            mb: "20px",
          }}
        >
          <Typography
            sx={{
              fontWeight: 700,
              color: accent,
              fontSize: "1rem",
              lineHeight: 1.3,
              maxWidth: "60%",
            }}
          >
            {label}
          </Typography>

          
        </Box>

        {/* Count number */}
        <Typography
          sx={{
            fontWeight: 800,
            color: "#111827",
            fontSize: "2.6rem",
            lineHeight: 1.1,
            letterSpacing: "-0.5px",
          }}
        >
          {data.count.toLocaleString()}
        </Typography>
      </Box>

      {/* Bottom: badge/trend + arrow */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mt: "20px",
        }}
      >
        {data.subtext ? (
          <Box sx={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <FaArrowTrendUp color="#2f9e6a" size={14} />
            <Typography sx={{ color: "#2f9e6a", fontWeight: 600, fontSize: "0.85rem" }}>
              {data.subtext}
            </Typography>
          </Box>
        ) : (
          <Typography sx={{ color: "#6b7280", fontWeight: 500, fontSize: "0.9rem" }}>
            
          </Typography>
        )}

        <Box sx={{ display: "flex", alignItems: "center", gap: "4px" }}>
          <Typography sx={{ color: accent, fontWeight: 600, fontSize: "0.85rem" }}>
            {badge}
          </Typography>
          {navigable && <FaArrowRight size={14} color={accent} />}
        </Box>

      </Box>
    </Box>
  );
};

/* ─── Main Page ───────────────────────────────────────────── */

const TechnologyPage = () => {
  const navigate = useNavigate();
  const { sub_tech_id } = useParams();
  const [subTech, setSubTech] = useState(null);
  const [loading, setLoading] = useState(true);
  const [globalCountry, setGlobalCountry] = useState(0);
  const [counts, setCounts] = useState(null);
  const [indiapublication, SetIndiaPublication] = useState(null);
  const [patentCounts, setPatentCounts] = useState(null);
  const [indiapatentcount, setIndiapatentCount] = useState(null);

  const countries = [
    { id: 0, name: "Global" },
    { id: 1, name: "India" },
    { id: 2, name: "China" },
    { id: 3, name: "United States" },
    { id: 4, name: "United Kingdom" },
    { id: 5, name: "Australia" },
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
        console.error("Error fetching sub-technology:", err);
        setLoading(false);
      });
  }, [sub_tech_id]);

  useEffect(() => {
    fetch("https://development.stieahub.in/Codigniter_api/public/get_global_publication_count")
      .then((res) => res.json())
      .then((data) => {
        const match = data.find((item) => String(item.sub_tech_id) === String(sub_tech_id));
        if (match) setCounts(match);
      })
      .catch((err) => console.error("Error fetching publication counts:", err));
  }, [sub_tech_id]);

  useEffect(() => {
    fetch("https://development.stieahub.in/Codigniter_api/public/get_india_publication_count")
      .then((res) => res.json())
      .then((data) => {
        const match = data.find((item) => String(item.sub_tech_id) === String(sub_tech_id));
        if (match) SetIndiaPublication(match);
      })
      .catch((err) => console.error("Error fetching publication counts:", err));
  }, [sub_tech_id]);

  useEffect(() => {
    fetch("https://development.stieahub.in/Codigniter_api/public/get_global_patent_count")
      .then((res) => res.json())
      .then((data) => {
        const match = data.find((item) => String(item.sub_tech_id) === String(sub_tech_id));
        if (match) setPatentCounts(match);
      })
      .catch((err) => console.error("Error fetching patent counts:", err));
  }, [sub_tech_id]);

  useEffect(() => {
    fetch("https://development.stieahub.in/Codigniter_api/public/get_india_patent_count")
      .then((res) => res.json())
      .then((data) => {
        const match = data.find((item) => String(item.sub_tech_id) === String(sub_tech_id));
        if (match) setIndiapatentCount(match);
      })
      .catch((err) => console.error("Error fetching patent counts:", err));
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
  const indiatotalpublication = Number(indiapublication?.total_publications || 0);
  const indiapatents = Number(indiapatentcount?.total_patents || 0);

  const cardData = [
    {
      count: totalPublications,
      subtext: counts?.growth_pct ? `+${counts.growth_pct}% from 2023` : null,
      url: `/ctt_dashboard/Publications/${sub_tech_id}`,
    },
    {
      count: totalPatents,
      subtext: patentCounts?.growth_pct ? `+${patentCounts.growth_pct}% from 2023` : null,
      url: `/ctt_dashboard/Patents/${sub_tech_id}`,
    },
    {
      count: indiatotalpublication,
      subtext: indiapublication?.growth_pct ? `+${indiapublication.growth_pct}% from 2023` : null,
      url: `/ctt_dashboard/get_india_publication_count/${sub_tech_id}`,
    },
    {
      count: indiapatents,
      subtext: indiapatentcount?.growth_pct ? `+${indiapatentcount.growth_pct}% from 2023` : null,
      url: `/ctt_dashboard/get_india_patent_count/${sub_tech_id}`,
    },
  ];

  return (
    <>
      <CTTHeader />
      <PageWrapper>

        {/* ── Header ── */}
        <HeaderRow>
          <Typography variant="h4" fontWeight={800} color="#111827">
            {subTech.sub_tech_name}
          </Typography>
          <FormControl sx={{ minWidth: 180 }} size="small" variant="outlined">
            <Select value={globalCountry} onChange={handleGlobalCountryChange} displayEmpty>
              {countries.map((c) => (
                <MenuItem key={c.id} value={c.id}>
                  {c.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </HeaderRow>

        {/* ── Description ── */}
        <DescriptionCard>
          <Typography variant="body1" sx={{ color: "#374151", lineHeight: 1.8, fontSize: "0.97rem" }}>
            {subTech.description || "Description not available for this sub-technology."}
          </Typography>
        </DescriptionCard>

        {/* ── Stat Cards: nowrap flex row, equal width ── */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            gap: "24px",
            width: "100%",
            mb: 3,
          }}
        >
          {cardData.map((item, index) => (
            <Box key={index} sx={{ flex: "1 1 0", minWidth: 0 }}>
              <StatCard
                data={item}
                theme={CARD_THEMES[index]}
                onClick={() => navigate(item.url)}
              />
            </Box>
          ))}
        </Box>

        {/* ── Charts ── */}
        <LargeDashboardCard>
          <Typography variant="h6" fontWeight={700} mb={0.5}>
            Country-wise Publications and Patent Trends
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={2}>
            A comparative view of scientific output and innovation activity across leading countries,
            covering total publications, top 10% and 1% highly cited papers, and patent grants and
            applications from 2003 to 2024.
          </Typography>
          <MultiLinePublicationGraph />
        </LargeDashboardCard>

        <LargeDashboardCard>
          <Typography variant="h6" fontWeight={700} mb={0.5}>
            Research Output and Citation Impact by Country
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={2}>
            A country-wise comparison of total scientific publications alongside the share of top 10%
            and top 1% highly cited papers, highlighting both research volume and quality across
            leading nations.
          </Typography>
          <ComparisonPublications />
        </LargeDashboardCard>

        <LargeDashboardCard>
          <Typography variant="h6" fontWeight={700} mb={0.5}>
            Patent Activity by Country: Applications and Grants
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={2}>
            A country-wise comparison of patent applications and grants, reflecting the innovation
            activity and intellectual property output of leading nations in this technology.
          </Typography>
          <PatentActivity />
        </LargeDashboardCard>

      </PageWrapper>
    </>
  );
};

export default TechnologyPage;



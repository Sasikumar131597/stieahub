import React, { useState, useEffect, useRef } from "react";
import "./css/Techselection.css";

const Techselection = ({ onSelectTech }) => { 
  const wrapperRef = useRef(null);

  const [data, setData] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [hoverTechIndex, setHoverTechIndex] = useState(null);
  const [selectedValue, setSelectedValue] = useState("");

  /** Load API **/
  useEffect(() => {
    (async () => {
      const res = await fetch(
        "https://development.stieahub.in/Codigniter_api/public/get_sub_techlogies"
      );
      const json = await res.json();
      setData(json);
    })();
  }, []);

  /** Search Filter **/
  const filteredData = data.filter(item =>
    item.technology_name.toLowerCase().includes(searchValue.toLowerCase()) ||
    item.sub_techs?.some(sub =>
      sub.sub_tech_name.toLowerCase().includes(searchValue.toLowerCase())
    )
  );

  /** Close dropdown on outside click **/
  useEffect(() => {
    const handler = e => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /** Common select handler → updates parent also */
  const handleSelection = (value) => {
    setSelectedValue(value);
    setSearchValue(value);
    setShowDropdown(false);

    onSelectTech(value); // Send selected tech to HomePage
  };

  return (
    <div className="main_grid_wrapper">

      <div className="left_section" ref={wrapperRef}>

        {/* Search Input */}
        <div className="tech_input_container">
          <input
            type="text"
            placeholder="Search technology or sub-technology"
            value={searchValue}
            onChange={e => { setSearchValue(e.target.value); setShowDropdown(true); }}
            onClick={() => setShowDropdown(true)}
          />
          <span className="arrow" onClick={() => setShowDropdown(!showDropdown)}>▼</span>
        </div>

        {/* Dropdown menu */}
        {showDropdown && (
          <div className="tech_dropdown_panel">

            {/* Left Menu - Technologies */}
            <div className="tech_left_menu">
              {filteredData.map((item, index) => (
                <div
                  key={index}
                  className={`tech_item ${hoverTechIndex === index ? "active" : ""}`}
                  onMouseEnter={() => setHoverTechIndex(index)}
                  onClick={() => handleSelection(item.technology_name)}
                >
                  {item.technology_name}
                </div>
              ))}
            </div>

            {/* Right Menu - Sub-tech */}
            <div className="tech_right_menu">
              <h4>Select Sub-Technology</h4>
              {hoverTechIndex !== null &&
                filteredData[hoverTechIndex]?.sub_techs?.map((sub, i) => (
                  <div
                    key={i}
                    className="sub_item"
                    onClick={() => handleSelection(sub.sub_tech_name)}
                  >
                    {sub.sub_tech_name}
                  </div>
                ))}
            </div>

          </div>
        )}

        <div className="selected_preview_box">
          <strong>Selected:</strong> {selectedValue || "None"}
        </div>
      </div>

      {/* Right Side Info Panel */}
      <div className="right_section_container">

        <div className="right_box">
          <h3>Technology Details</h3>

          {/* <div className="detail_card">
            <p><b>Selected Item :</b> {selectedValue || "Please choose from left"}</p>
          </div> */}

          <div className="detail_card">
            {/* <p><b>Description:</b> Content updates automatically on selection.</p> */}
            Genetic engineering refers to the set of molecular biology methods used to deliberately modify the genetic makeup of organisms, by inserting, deleting, or altering DNA sequences to achieve desired traits. Modern techniques include gene editing, homologous recombination, transgenic methods, and synthetic biology tools. Genetic engineering has found application in the field of enhanced agriculture (drought or disease resistant crops), improved medical therapies (gene therapy for genetic disorders, personalized medicine), bioremediation, vaccine development as well as industrial enzyme production. All of these applications provide ways of solving pressing global challenges that include food security, health inequities, environmental degradation and improving quality of life in many regions.
          </div>

        </div>

      </div>

    </div>
  );

};

export default Techselection;



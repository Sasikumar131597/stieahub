import React from "react";
import "./header_sidebar_components/styles/main.css";
import PageTitle from "./PageTitle";
import DashboardCards from "./GERD_Dashboard/DashboardCards";
import Footer from "./header_sidebar_components/Footer";
import HomeBanner from '../images/STIEA-sample.png';

function Main() {
  return (
    <main id="main" className="main">
      {/* <PageTitle page="STI Ecosystem Metrics and Analytics" /> */}

      <section>
            <img src={HomeBanner}  />
      </section>

      {/* <section className="description">
        <p className="dashboard-intro-text">
          Science, Technology and Innovation (STI) play a crucial role in addressing economic, social, and ecological challenges. The STI ecosystem can be understood from key indicators covering inputs, processes, drivers, incentives, outputs, outcomes, and impact. These indicators provide essential resources for policymakers and stakeholders, enabling evidence-driven policy and programme implementation. Global comparative reports on STI use these indicators or composite versions to compare countries and economies.
        </p>
      </section> */}

      

      <section className="dashboard-cards-container">
        <DashboardCards />
      </section>

      <section className="footercontainer"> 
        <Footer />
       </section>
    </main>
    
  );
}

export default Main;
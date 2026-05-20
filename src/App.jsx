import Header from "./sections/Header.jsx";
import Hero from "./sections/Hero.jsx";
import Metrics from "./sections/Metrics.jsx";
import Proof from "./sections/Proof.jsx";
import Problem from "./sections/Problem.jsx";
import Builds from "./sections/Builds.jsx";
import Examples from "./sections/Examples.jsx";
import FlowDiagram from "./sections/FlowDiagram.jsx";
import Tools from "./sections/Tools.jsx";
import Steps from "./sections/Steps.jsx";
import Deliverables from "./sections/Deliverables.jsx";
import Security from "./sections/Security.jsx";
import RecentWork from "./sections/RecentWork.jsx";
import FAQ from "./sections/FAQ.jsx";
import Why from "./sections/Why.jsx";
import FinalCTA from "./sections/FinalCTA.jsx";
import Footer from "./sections/Footer.jsx";

export default function App() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Metrics />
        <Proof />
        <Problem />
        <Builds />
        <Examples />
        <FlowDiagram />
        <Tools />
        <Steps />
        <Deliverables />
        <Security />
        <RecentWork />
        <FAQ />
        <Why />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}

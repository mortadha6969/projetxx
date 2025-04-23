import ImageBanner from "../../components/ImageBanner/ImageBanner";
import BlogSection from "../../components/BlogSection/BlogSection";
import CrowdfundingSection from "../../components/CrowdfundingSection/CrowdfundingSection";

function Home() {
  return (
    <div className="Home" id="home">
      <ImageBanner
        imageUrl="/Images/images.jpg"
        title="Welcome to TrueFunding!"
        description="Support a cause that matters to you. Donate to a campaign today."
        breadcrumbs={["Home", "Active Page"]}
      />
      <CrowdfundingSection />

      <BlogSection />
    </div>
  );
}

export default Home;

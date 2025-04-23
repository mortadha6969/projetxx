import React from 'react';
import './BlogSection.css';

const BlogSection = () => {
  // Sample blog data
  const featuredPosts = [
    {
      id: 1,
      title: "Meet Our Team: Behind the Scenes",
      category: "Team Stories",
      excerpt: "Discover the passionate individuals driving our mission forward...",
      date: "March 15, 2024",
      image: "https://source.unsplash.com/800x600/?team"
    },
    {
      id: 2,
      title: "New Education Program Launch",
      category: "Programs",
      excerpt: "Learn about our innovative approach to community learning...",
      date: "March 12, 2024",
      image: "https://source.unsplash.com/800x600/?education"
    },
    {
      id: 3,
      title: "Success Stories: Impact Report 2023",
      category: "Success Stories",
      excerpt: "See how we've transformed lives across 20+ communities...",
      date: "March 10, 2024",
      image: "https://source.unsplash.com/800x600/?success"
    }
  ];

  const teamMembers = [
    { name: "Sarah Johnson", role: "CEO & Founder", bio: "20+ years in community development..." },
    { name: "Michael Chen", role: "Program Director", bio: "Education specialist and..." },
    { name: "Amina Diallo", role: "Outreach Coordinator", bio: "Passionate about creating..." }
  ];

  return (
    <div className="blog-container">
      <h2 className="section-title">Our Stories & Initiatives</h2>
      
      {/* Featured Posts Grid */}
      <div className="featured-posts">
        {featuredPosts.map(post => (
          <div key={post.id} className="post-card">
            <img src={post.image} alt={post.title} className="post-image" />
            <div className="post-content">
              <span className="post-category">{post.category}</span>
              <h3>{post.title}</h3>
              <p className="post-excerpt">{post.excerpt}</p>
              <div className="post-meta">
                <span>{post.date}</span>
                <button className="read-more">Read Story →</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Team Section */}
      <div className="team-section">
        <h3>Leadership Team</h3>
        <div className="team-grid">
          {teamMembers.map(member => (
            <div key={member.name} className="team-card">
              <div className="member-info">
                <h4>{member.name}</h4>
                <p className="role">{member.role}</p>
                <p className="bio">{member.bio}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Programs Section */}
      <div className="programs-section">
        <h3>Current Programs</h3>
        <div className="programs-grid">
          <div className="program-card">
            <h4>Education Initiative</h4>
            <p>Scholarships and learning resources for underserved communities</p>
            <div className="stats">
              <span>500+ Students Helped</span>
              <span>2021-Present</span>
            </div>
          </div>
          <div className="program-card">
            <h4>Community Health</h4>
            <p>Mobile clinics and health awareness campaigns</p>
            <div className="stats">
              <span>10,000+ Served</span>
              <span>2023-Present</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogSection;
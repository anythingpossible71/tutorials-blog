import { prisma } from "../lib/prisma";

async function main() {
  // Create default roles
  const userRole = await prisma.role.upsert({
    where: { name: "user" },
    update: {},
    create: {
      name: "user",
    },
  });

  const adminRole = await prisma.role.upsert({
    where: { name: "admin" },
    update: {},
    create: {
      name: "admin",
    },
  });

  // Create categories
  const techCategory = await prisma.category.upsert({
    where: { slug: "tech" },
    update: {},
    create: {
      name: "Tech",
      slug: "tech",
      description: "Technology and development articles",
    },
  });

  const designCategory = await prisma.category.upsert({
    where: { slug: "design" },
    update: {},
    create: {
      name: "Design",
      slug: "design",
      description: "Design and UX articles",
    },
  });

  const coachingCategory = await prisma.category.upsert({
    where: { slug: "coaching" },
    update: {},
    create: {
      name: "Coaching",
      slug: "coaching",
      description: "Coaching and personal development",
    },
  });

  // Create a mock user (you'll replace this with your actual user)
  const mockUser = await prisma.user.upsert({
    where: { email: "avi@example.com" },
    update: {},
    create: {
      email: "avi@example.com",
      password: "hashed_password_placeholder", // This will be replaced when you sign up
    },
  });

  // Create mock posts
  const posts = [
    {
      title: "The Evolution of User-Centered Design: Balancing Aesthetic Innovation with Accessibility Standards",
      content: `# The Evolution of User-Centered Design

Gone are the days when design was purely about making things look beautiful. Today's designers must navigate a complex ecosystem where user experience, accessibility, brand identity, and technical constraints all converge to create meaningful digital products.

## The Paradigm Shift

The design landscape has evolved dramatically over the past decade. We've moved from static, pixel-perfect designs to dynamic, responsive systems that adapt to user needs and contexts. Companies like Airbnb, Google, and IBM have pioneered design systems that scale across platforms and devices.

## Breaking Down Barriers

Accessibility has become integral to the design process, not an afterthought. The Web Content Accessibility Guidelines (WCAG) provide a framework for creating inclusive digital experiences. This includes considerations like:

- Color contrast ratios for users with visual impairments
- Keyboard navigation for users with motor disabilities
- Screen reader compatibility for users with visual impairments
- Typography improvements for users with dyslexia

## The Psychology of Digital Engagement

Understanding how design psychology influences user interaction is crucial. Micro-interactions serve as tools for feedback and emotional connection, while color psychology continues to evolve with our understanding of cultural context and dark mode interfaces.

## Future Horizons

As we look ahead, emerging technologies like Augmented Reality (AR), Virtual Reality (VR), and AI-powered personalization will create even more adaptive and human-centered digital experiences.`,
      excerpt: "Gone are the days when design was purely about making things look beautiful. Today's designers must navigate a complex ecosystem where user experience, accessibility, brand identity, and technical constraints all converge to create meaningful digital products.",
      slug: "evolution-user-centered-design",
      status: "published" as const,
      reading_time: 8,
      published_at: new Date("2024-03-15"),
      categories: ["design", "tech"],
    },
    {
      title: "Building Scalable Product Teams: Lessons from Silicon Valley to Startup",
      content: `# Building Scalable Product Teams

Product development is as much about people as it is about technology. The most successful product teams understand that scaling isn't just about adding more engineers—it's about creating systems that enable collaboration, innovation, and sustainable growth.

## The Foundation: Clear Vision and Strategy

Every successful product team starts with a clear vision. This isn't just a mission statement on a wall; it's a living document that guides every decision, from feature prioritization to hiring choices. The vision should be ambitious enough to inspire but specific enough to provide direction.

## Communication Patterns That Scale

As teams grow, communication becomes the bottleneck. Successful product teams implement structured communication patterns:

- **Daily standups** for tactical alignment
- **Weekly reviews** for strategic discussions
- **Monthly retrospectives** for process improvement
- **Quarterly planning** for long-term vision

## The Role of Product Managers

Product managers serve as the bridge between business objectives and technical implementation. They must balance competing priorities while maintaining team morale and product quality. The best PMs are data-driven but human-centered.

## Technical Excellence as a Foundation

Technical debt is the silent killer of product velocity. Teams that prioritize code quality, automated testing, and continuous integration can move faster in the long run. This requires investment in tools, processes, and team training.`,
      excerpt: "Product development is as much about people as it is about technology. The most successful product teams understand that scaling isn't just about adding more engineers—it's about creating systems that enable collaboration, innovation, and sustainable growth.",
      slug: "building-scalable-product-teams",
      status: "published" as const,
      reading_time: 6,
      published_at: new Date("2024-03-10"),
      categories: ["coaching", "tech"],
    },
    {
      title: "The Psychology of User Onboarding: Converting Visitors into Engaged Users",
      content: `# The Psychology of User Onboarding

User onboarding is the critical moment when a visitor becomes a user. It's not just about teaching features—it's about creating an emotional connection and demonstrating immediate value. The psychology behind effective onboarding reveals why some products succeed while others fail.

## The First Impression Principle

Users form their first impression within seconds of interacting with your product. This impression is incredibly difficult to change once established. Successful onboarding leverages this by:

- **Immediate value demonstration** - Show users what they can accomplish right away
- **Progressive disclosure** - Introduce complexity gradually
- **Emotional connection** - Create moments of delight and achievement

## Cognitive Load and Learning Curves

Human cognitive capacity is limited. Effective onboarding respects these limitations by:

- **Chunking information** into digestible pieces
- **Providing context** for each new concept
- **Using familiar patterns** to reduce learning friction
- **Offering help** without being intrusive

## The Power of Progress Indicators

Progress indicators serve multiple psychological functions:

- **Motivation** - Users want to complete what they've started
- **Expectation setting** - Clear timelines reduce anxiety
- **Achievement recognition** - Celebrating small wins builds confidence

## Personalization and Adaptation

The most effective onboarding experiences adapt to individual users. This includes:

- **Role-based content** for different user types
- **Adaptive pacing** based on user behavior
- **Contextual help** that appears when needed
- **Personalized examples** that resonate with specific users`,
      excerpt: "User onboarding is the critical moment when a visitor becomes a user. It's not just about teaching features—it's about creating an emotional connection and demonstrating immediate value.",
      slug: "psychology-user-onboarding",
      status: "published" as const,
      reading_time: 7,
      published_at: new Date("2024-02-28"),
      categories: ["design", "coaching"],
    },
    {
      title: "Modern CSS Architecture: From BEM to CSS-in-JS and Beyond",
      content: `# Modern CSS Architecture

CSS has evolved from simple styling to a powerful design system language. Modern CSS architecture must balance maintainability, performance, and developer experience while supporting complex design requirements.

## The Evolution of CSS Methodologies

CSS architecture has gone through several phases:

**BEM (Block Element Modifier)**
- Provides clear naming conventions
- Reduces specificity conflicts
- Scales well for large projects

**CSS Modules**
- Local scope by default
- Composable and reusable
- Better developer experience

**CSS-in-JS**
- Dynamic styling capabilities
- Component-scoped styles
- Runtime theme support

## Design Systems and CSS

Modern design systems require CSS that can:

- **Scale** across multiple products and teams
- **Adapt** to different contexts and themes
- **Maintain** consistency across platforms
- **Support** rapid iteration and experimentation

## Performance Considerations

CSS performance impacts user experience:

- **Critical CSS** - Inline above-the-fold styles
- **Code splitting** - Load styles only when needed
- **Tree shaking** - Remove unused styles
- **Optimization** - Minification and compression

## The Future of CSS

Emerging CSS features are changing how we think about styling:

- **Container queries** for component-based responsive design
- **CSS Grid** for complex layouts
- **Custom properties** for dynamic theming
- **Logical properties** for internationalization`,
      excerpt: "CSS has evolved from simple styling to a powerful design system language. Modern CSS architecture must balance maintainability, performance, and developer experience while supporting complex design requirements.",
      slug: "modern-css-architecture",
      status: "published" as const,
      reading_time: 5,
      published_at: new Date("2024-02-15"),
      categories: ["tech"],
    },
    {
      title: "Leadership in Remote Teams: Building Trust and Culture Across Distance",
      content: `# Leadership in Remote Teams

Remote work has fundamentally changed how we lead teams. The traditional model of management—based on physical presence and direct oversight—no longer applies. Successful remote leadership requires new skills, tools, and mindsets.

## Trust as the Foundation

Remote teams require trust to function effectively. This trust must be:

- **Earned** through consistent actions and communication
- **Demonstrated** through transparency and vulnerability
- **Maintained** through regular check-ins and support
- **Protected** by addressing conflicts quickly and fairly

## Communication Strategies

Effective remote communication goes beyond video calls:

- **Asynchronous communication** for deep work and global teams
- **Written documentation** for clarity and reference
- **Regular rituals** for team bonding and alignment
- **Multiple channels** for different types of communication

## Building Remote Culture

Culture in remote teams emerges from intentional design:

- **Shared values** that guide decision-making
- **Regular celebrations** of wins and milestones
- **Inclusive practices** that work across time zones
- **Mental health support** for the challenges of remote work

## Performance Management

Remote performance management focuses on outcomes, not activity:

- **Clear expectations** and measurable goals
- **Regular feedback** and development conversations
- **Autonomy** balanced with accountability
- **Recognition** of contributions and achievements`,
      excerpt: "Remote work has fundamentally changed how we lead teams. The traditional model of management—based on physical presence and direct oversight—no longer applies. Successful remote leadership requires new skills, tools, and mindsets.",
      slug: "leadership-remote-teams",
      status: "published" as const,
      reading_time: 9,
      published_at: new Date("2024-02-01"),
      categories: ["coaching"],
    },
  ];

  // Create posts and their category relationships
  for (const postData of posts) {
    const { categories, ...postFields } = postData;
    
    const post = await prisma.post.upsert({
      where: { slug: postFields.slug },
      update: {},
      create: {
        ...postFields,
        author_id: mockUser.id,
      },
    });

    // Connect posts to categories
    for (const categorySlug of categories) {
      const category = await prisma.category.findUnique({
        where: { slug: categorySlug },
      });
      
      if (category) {
        await prisma.postCategory.create({
          data: {
            post_id: post.id,
            category_id: category.id,
          },
        });
      }
    }
  }

  console.log({ userRole, adminRole });
  console.log("Blog data seeded successfully!");
  console.log("Created categories:", [techCategory.name, designCategory.name, coachingCategory.name]);
  console.log("Created posts:", posts.length);
  console.log("Note: Use the first-time setup flow to create your admin user.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

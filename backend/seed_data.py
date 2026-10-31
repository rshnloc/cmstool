"""
Data Seeder for Chronicle CMS
Contains strictly synthetic, RFC-compliant mock data.
Zero real credentials, zero PII, zero real emails or addresses.
"""

from datetime import datetime, timezone, timedelta
from app.core.database import SessionLocal, Base, engine
from app.core.security import hash_password
from app.models.entities import User, Category, Tag, Post, Page, Setting

def run_seed():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    try:
        # Check if already seeded
        existing_user = db.query(User).filter(User.username == "admin").first()
        if existing_user:
            print("Database already contains seed data. Skipping initialization.")
            return

        print("Seeding initial CMS data...")

        # 1. Users
        admin_user = User(
            username="admin",
            email="admin@example.org",
            full_name="Lead Administrator",
            hashed_password=hash_password("admin123"),
            role="admin",
            is_active=True,
            created_at=datetime.now(timezone.utc),
        )
        editor_user = User(
            username="editor",
            email="editor@example.org",
            full_name="Content Editor",
            hashed_password=hash_password("editor123"),
            role="editor",
            is_active=True,
            created_at=datetime.now(timezone.utc),
        )
        db.add_all([admin_user, editor_user])
        db.flush()

        # 2. Categories
        cat_eng = Category(
            name="Engineering & Architecture",
            slug="engineering-architecture",
            description="Deep dives into scalable backend systems, APIs, and microservices.",
        )
        cat_frontend = Category(
            name="Frontend & Design",
            slug="frontend-design",
            description="Modern UI patterns, component-driven development, and TypeScript.",
        )
        cat_cms = Category(
            name="Content Strategy",
            slug="content-strategy",
            description="Best practices for editorial workflows and content modeling.",
        )
        cat_devops = Category(
            name="Cloud & DevOps",
            slug="cloud-devops",
            description="Continuous deployment, containerization, and monitoring.",
        )
        db.add_all([cat_eng, cat_frontend, cat_cms, cat_devops])
        db.flush()

        # 3. Tags
        tag_python = Tag(name="Python", slug="python")
        tag_ts = Tag(name="TypeScript", slug="typescript")
        tag_fastapi = Tag(name="FastAPI", slug="fastapi")
        tag_react = Tag(name="React", slug="react")
        tag_tailwind = Tag(name="Tailwind", slug="tailwind")
        tag_api = Tag(name="REST API", slug="rest-api")
        db.add_all([tag_python, tag_ts, tag_fastapi, tag_react, tag_tailwind, tag_api])
        db.flush()

        # 4. Settings (Strictly mock contact details)
        settings_data = [
            ("site_title", "Chronicle CMS", "Public website title"),
            ("site_tagline", "High-Performance Content Management Engine", "Hero tagline on homepage"),
            ("site_description", "A modern content platform engineered with Python and TypeScript for lightning-fast digital experiences.", "Meta description for SEO"),
            ("contact_email", "contact@example.org", "Generic contact inbox"),
            ("contact_phone", "+1-555-0199", "Generic fictitious contact phone"),
            ("contact_address", "100 Innovation Way, Suite 400, Tech City, TC 94016", "Generic fictitious office address"),
            ("footer_copyright", "© 2026 Chronicle CMS Platform. Built for developers and content editors.", "Footer copyright notice"),
        ]
        for key, val, desc in settings_data:
            db.add(Setting(key=key, value=val, description=desc))

        # 5. Pages
        about_page = Page(
            title="About Chronicle CMS",
            slug="about",
            template="standard",
            meta_description="Learn how Chronicle CMS combines Python backend speed with TypeScript UI agility.",
            content="""# About Chronicle CMS

Welcome to **Chronicle CMS**, an open architecture engineered to bridge the power of Python backend services with the reactivity of modern TypeScript interfaces.

### Core Architecture Pillars

1. **High Throughput REST API**: Built atop FastAPI and SQLAlchemy, providing typed schemas, lightning-fast response times, and automated interactive OpenAPI documentation.
2. **Type-Safe Frontend Studio**: Created using React, Vite, and Tailwind CSS to give editors an uncluttered publishing workspace and readers a blazing-fast responsive reading experience.
3. **Decoupled Content Delivery**: Content models are structured to serve both traditional web pages and multi-device API consumers seamlessly.
4. **Security by Default**: Role-based access controls, robust PBKDF2 hashing, and isolated JWT authentication tokens.

Whether you are publishing technical articles, maintaining company documentation, or running a content-heavy digital portal, Chronicle provides the foundation to build upon.
""",
            is_published=True,
            created_at=datetime.now(timezone.utc),
            updated_at=datetime.now(timezone.utc),
        )

        contact_page = Page(
            title="Contact Our Team",
            slug="contact",
            template="contact",
            meta_description="Reach out to the Chronicle editorial and engineering team.",
            content="""# Get in Touch

Have questions about our content platform or want to explore collaboration opportunities? We'd love to hear from you.

### Headquarters & Inquiries
- **Office Location**: 100 Innovation Way, Suite 400, Tech City, TC 94016
- **General Inquiries**: contact@example.org
- **Editorial Desk**: editor@example.org
- **Telephone**: +1-555-0199

Our support and editorial desks review inquiries Monday through Friday, 9:00 AM – 5:00 PM (UTC).
""",
            is_published=True,
            created_at=datetime.now(timezone.utc),
            updated_at=datetime.now(timezone.utc),
        )

        privacy_page = Page(
            title="Privacy and Data Policy",
            slug="privacy",
            template="standard",
            meta_description="Sample demonstration privacy policy for Chronicle CMS.",
            content="""# Privacy & Data Policy

### 1. Overview
Chronicle CMS is designed to safeguard user privacy. This demonstration platform does not harvest personal user tracking identifiers or sell data to third parties.

### 2. Information Handled
- **Authentication**: Usernames and salted hashes for authenticated editorial personnel.
- **Editorial Assets**: Published articles, categories, and uploaded media files.
- **Anonymous Metrics**: Aggregated article view counters for content popularity ranking.

### 3. Contacting the Data Protection Desk
If you have questions regarding data compliance in this mock environment, please reach out to `privacy@example.org`.
""",
            is_published=True,
            created_at=datetime.now(timezone.utc),
            updated_at=datetime.now(timezone.utc),
        )
        db.add_all([about_page, contact_page, privacy_page])

        # 6. Posts
        now = datetime.now(timezone.utc)
        posts_data = [
            {
                "title": "Architecting a Headless CMS with Python and FastAPI",
                "slug": "architecting-headless-cms-python-fastapi",
                "excerpt": "Discover how Python's asynchronous ecosystem and Pydantic validation deliver blazing-fast CMS backends.",
                "category": cat_eng,
                "tags": [tag_python, tag_fastapi, tag_api],
                "reading_time": 4,
                "status": "published",
                "views": 342,
                "published_offset": 5,
                "content": """## The Rise of Asynchronous Content Delivery

Traditional monolith CMS architectures often bundle template rendering with database queries, introducing server overhead when traffic surges. A headless architecture decouples content authoring from content consumption.

### Why Python with FastAPI?

FastAPI provides an optimal balance for content management engines:

- **Type Safety with Pydantic**: Every post, page, and taxonomy request is validated at runtime with zero boilerplate.
- **Async I/O Performance**: Handles concurrent media uploads and database interactions without blocking threads.
- **Automated OpenAPI Contracts**: Frontend developers receive instant, interactive API documentation at `/docs`.

```python
@app.get("/api/public/posts")
def get_posts(category: str | None = None):
    # Instant filtered querying with SQLAlchemy
    return fetch_published_articles(category)
```

By decoupling storage from presentation, teams can seamlessly deliver articles to web apps, mobile clients, and syndicated feeds with minimal latency.
""",
            },
            {
                "title": "Building Modern Editorial Dashboards in TypeScript & React",
                "slug": "building-modern-editorial-dashboards-typescript-react",
                "excerpt": "How to craft intuitive, responsive publishing workspaces that writers and editors actually love.",
                "category": cat_frontend,
                "tags": [tag_ts, tag_react, tag_tailwind],
                "reading_time": 5,
                "status": "published",
                "views": 519,
                "published_offset": 3,
                "content": """## Crafting an Intuitive Publishing Experience

Great CMS dashboards empower content creators to focus on writing rather than struggling with convoluted menus.

### Key Considerations for CMS Frontend Design

1. **Distraction-Free Editing**: Provide responsive markdown writing areas with live side-by-side previews.
2. **Instant Status Feedback**: Visual status badges (Draft, Published, Archived) eliminate publishing guesswork.
3. **Asset Management Integration**: Allow writers to drop media files directly into articles without leaving the editor context.

```typescript
interface PostPayload {
  title: string;
  slug: string;
  content: string;
  status: 'draft' | 'published' | 'archived';
  category_id?: number;
}
```

Using Tailwind CSS and Lucide icons allows rapid iteration while keeping the bundle size microscopic.
""",
            },
            {
                "title": "Effective Taxonomy Design: Categories versus Tags",
                "slug": "effective-taxonomy-design-categories-tags",
                "excerpt": "A pragmatic guide to organizing your digital publications for search engines and human readers.",
                "category": cat_cms,
                "tags": [tag_api],
                "reading_time": 3,
                "status": "published",
                "views": 210,
                "published_offset": 1,
                "content": """## Structuring Content for Discoverability

One of the most frequent dilemmas when modeling CMS schema is deciding between **Categories** and **Tags**.

### Categories: Broad Topical Hierarchies
- Categories should represent the primary thematic sections of your publication.
- Every article should belong to exactly one primary category (e.g. *Engineering*, *Design*, or *Strategy*).
- Categories dictate site navigation menus and top-level URL paths.

### Tags: Cross-Cutting Identifiers
- Tags identify specific technologies, people, or granular concepts mentioned within a post.
- An article can have multiple tags (e.g. `python`, `typescript`, `sqlite`).
- Tags enable readers to discover related content across completely different categories.
""",
            },
            {
                "title": "Upcoming Features: Dynamic Block Layouts & Scheduled Publishing",
                "slug": "upcoming-features-dynamic-block-layouts",
                "excerpt": "A preview of the next iteration of Chronicle CMS, featuring scheduled releases and modular block builders.",
                "category": cat_cms,
                "tags": [tag_fastapi, tag_ts],
                "reading_time": 2,
                "status": "draft",
                "views": 14,
                "published_offset": 0,
                "content": """## Road Ahead for Chronicle CMS

We are actively testing experimental features to elevate editorial workflows:

- **Time-Based Publishing**: Schedule posts to flip from draft to published at exact future timestamps.
- **Flexible Content Blocks**: Reorderable modules for quote callouts, code sandboxes, and image galleries.
- **Multi-Role Approvals**: Editorial review cycles requiring sign-off prior to live publication.
""",
            },
        ]

        for pdata in posts_data:
            post = Post(
                title=pdata["title"],
                slug=pdata["slug"],
                excerpt=pdata["excerpt"],
                content=pdata["content"],
                status=pdata["status"],
                reading_time_minutes=pdata["reading_time"],
                views=pdata["views"],
                author_id=admin_user.id,
                category_id=pdata["category"].id,
                created_at=now - timedelta(days=pdata["published_offset"] + 1),
                updated_at=now - timedelta(days=pdata["published_offset"]),
                published_at=now - timedelta(days=pdata["published_offset"]) if pdata["status"] == "published" else None,
                tags=pdata["tags"],
            )
            db.add(post)

        db.commit()
        print("Initial CMS data successfully seeded!")
        print("Demo Accounts:")
        print("  Admin  -> username: admin  | password: admin123")
        print("  Editor -> username: editor | password: editor123")

    except Exception as e:
        db.rollback()
        print(f"Error seeding database: {e}")
        raise
    finally:
        db.close()

if __name__ == "__main__":
    run_seed()

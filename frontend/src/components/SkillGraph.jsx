import React, { useMemo } from "react";
import "../styles/SkillGraph.css";
import { FaFire, FaChartPie, FaLightbulb, FaCheckCircle } from "react-icons/fa";

const CATEGORY_MAP = {
  Frontend: ["react", "vue", "angular", "html", "css", "javascript", "typescript", "tailwind", "next.js", "redux", "ui/ux", "figma"],
  Backend: ["node.js", "express", "python", "django", "flask", "java", "spring", "go", "golang", "c#", "php", "ruby"],
  Database: ["mongodb", "postgresql", "mysql", "redis", "firebase", "sqlite", "prisma", "sql"],
  "Cloud / DevOps": ["aws", "docker", "kubernetes", "ci/cd", "git", "github", "linux", "gcp", "azure"],
  "AI & Data": ["machine learning", "nlp", "tensorflow", "pytorch", "pandas", "scikit-learn", "deep learning", "data analysis"],
};

const LEVEL_LABELS = {
  1: "Beginner",
  2: "Elementary",
  3: "Intermediate",
  4: "Advanced",
  5: "Expert",
};

export default function SkillGraph({ skills = [] }) {
  // Normalize skills into array of { name, level }
  const normalizedSkills = useMemo(() => {
    if (!Array.isArray(skills)) return [];
    return skills.map((s) => {
      if (typeof s === "string") {
        return { name: s, level: 3 };
      }
      return {
        name: s.name || "Skill",
        level: Math.max(1, Math.min(5, Number(s.level) || 3)),
      };
    });
  }, [skills]);

  // Strongest skills (level >= 4, or sorted top)
  const strongestSkills = useMemo(() => {
    return [...normalizedSkills]
      .sort((a, b) => b.level - a.level)
      .slice(0, 4);
  }, [normalizedSkills]);

  // Categorized breakdown
  const categorized = useMemo(() => {
    const buckets = {
      Frontend: [],
      Backend: [],
      Database: [],
      "Cloud / DevOps": [],
      "AI & Data": [],
      Other: [],
    };

    normalizedSkills.forEach((skill) => {
      let matched = false;
      const lower = skill.name.toLowerCase();
      for (const [cat, names] of Object.entries(CATEGORY_MAP)) {
        if (names.some((n) => lower.includes(n))) {
          buckets[cat].push(skill);
          matched = true;
          break;
        }
      }
      if (!matched) {
        buckets.Other.push(skill);
      }
    });

    return buckets;
  }, [normalizedSkills]);

  // Skill gaps analysis
  const skillGaps = useMemo(() => {
    const gaps = [];
    const lowerNames = normalizedSkills.map((s) => s.name.toLowerCase());

    const hasFrontend = normalizedSkills.some((s) =>
      CATEGORY_MAP.Frontend.some((f) => s.name.toLowerCase().includes(f))
    );
    const hasBackend = normalizedSkills.some((s) =>
      CATEGORY_MAP.Backend.some((b) => s.name.toLowerCase().includes(b))
    );
    const hasDatabase = normalizedSkills.some((s) =>
      CATEGORY_MAP.Database.some((d) => s.name.toLowerCase().includes(d))
    );
    const hasDevOps = normalizedSkills.some((s) =>
      CATEGORY_MAP["Cloud / DevOps"].some((c) => s.name.toLowerCase().includes(c))
    );

    if (hasFrontend && !hasBackend) {
      gaps.push({
        area: "Backend Development",
        tip: "Consider learning Node.js or Python to become a full-stack developer.",
      });
    }
    if ((hasFrontend || hasBackend) && !hasDatabase) {
      gaps.push({
        area: "Database Management",
        tip: "Adding MongoDB or PostgreSQL will elevate your project execution ability.",
      });
    }
    if (!hasDevOps && normalizedSkills.length >= 3) {
      gaps.push({
        area: "DevOps & CI/CD",
        tip: "Docker or Git workflow skills are highly valued by team creators.",
      });
    }

    return gaps;
  }, [normalizedSkills]);

  if (normalizedSkills.length === 0) {
    return (
      <div className="skill-graph-empty">
        <p>No skills recorded yet. Add your skills and proficiency levels to visualize your skill graph.</p>
      </div>
    );
  }

  return (
    <div className="skill-graph-container">
      <div className="skill-graph-header">
        <div>
          <h3>📊 Skill Graph & Proficiency Analysis</h3>
          <p>Database-driven visual representation of your technical competencies</p>
        </div>
        <span className="total-skills-badge">{normalizedSkills.length} Total Skills</span>
      </div>

      {/* STRONGEST SKILLS */}
      {strongestSkills.length > 0 && (
        <div className="strongest-skills-banner">
          <div className="banner-title">
            <FaFire className="fire-icon" />
            <strong>Top Competencies:</strong>
          </div>
          <div className="strongest-badges">
            {strongestSkills.map((s, idx) => (
              <span key={idx} className="strongest-pill">
                ⭐ {s.name} <small>({LEVEL_LABELS[s.level]} • {s.level * 20}%)</small>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* PROFICIENCY BARS */}
      <div className="proficiency-bars-grid">
        {normalizedSkills.map((s, idx) => {
          const pct = s.level * 20;
          return (
            <div key={idx} className="skill-bar-card">
              <div className="skill-bar-info">
                <span className="skill-name">{s.name}</span>
                <span className="skill-level-text">
                  {LEVEL_LABELS[s.level]} ({s.level}/5)
                </span>
              </div>
              <div className="progress-track">
                <div
                  className={`progress-fill level-${s.level}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* CATEGORIES BREAKDOWN */}
      <div className="categories-section">
        <h4>
          <FaChartPie /> Category Distribution
        </h4>
        <div className="categories-chips">
          {Object.entries(categorized).map(([cat, list]) => {
            if (list.length === 0) return null;
            return (
              <div key={cat} className="category-chip">
                <strong>{cat}:</strong>
                <span>
                  {list.map((item) => item.name).join(", ")}
                </span>
                <small className="cat-count">{list.length}</small>
              </div>
            );
          })}
        </div>
      </div>

      {/* SKILL GAPS INSIGHT */}
      {skillGaps.length > 0 && (
        <div className="skill-gaps-card">
          <h4>
            <FaLightbulb /> Growth Insights & Skill Gaps
          </h4>
          <ul>
            {skillGaps.map((gap, idx) => (
              <li key={idx}>
                <strong>{gap.area}:</strong> {gap.tip}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

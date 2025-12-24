import type React from "react"
import type {
    DocumentSchema,
    ResumeHeaderComponent,
    SummaryComponent,
    ExperienceComponent,
    EducationComponent,
    SkillsComponent,
    ProjectsComponent,
    CertificationsComponent,
} from "@/lib/types/schema"
import { cn } from "@/lib/utils"

interface ResumeRendererProps {
    document: DocumentSchema
    className?: string
}

export function ResumeRenderer({ document, className }: ResumeRendererProps) {
    const { theme, components } = document

    // Helper to find components by type
    const header = components.find((c) => c.type === "resume-header") as ResumeHeaderComponent | undefined
    const summary = components.find((c) => c.type === "summary") as SummaryComponent | undefined
    const experience = components.find((c) => c.type === "experience") as ExperienceComponent | undefined
    const education = components.find((c) => c.type === "education") as EducationComponent | undefined
    const skills = components.find((c) => c.type === "skills") as SkillsComponent | undefined
    const projects = components.find((c) => c.type === "projects") as ProjectsComponent | undefined
    const certifications = components.find((c) => c.type === "certifications") as CertificationsComponent | undefined

    // Base styles for A4 layout
    const baseStyles = "bg-white text-black min-h-[297mm] w-full max-w-[210mm] mx-auto p-6 sm:p-12 shadow-sm"

    // Theme variants (basic for now, can be expanded)
    const themeStyles = {
        clean: "font-sans",
        minimal: "font-sans",
        professional: "font-serif",
        modern: "font-sans",
        developer: "font-mono",
    }

    const currentTheme = themeStyles[theme as keyof typeof themeStyles] || themeStyles.clean

    return (
        <div className={cn(baseStyles, currentTheme, className)} id="resume-preview">
            {/* Header */}
            {header && (
                <header className="mb-8 border-b pb-8">
                    <h1 className="text-4xl font-bold mb-2 uppercase tracking-wide">{header.name}</h1>
                    <p className="text-xl text-gray-600 mb-4">{header.title}</p>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                        {header.email && <span>{header.email}</span>}
                        {header.phone && <span>• {header.phone}</span>}
                        {header.location && <span>• {header.location}</span>}
                        {header.website && <span>• {header.website}</span>}
                        {header.linkedin && <span>• {header.linkedin}</span>}
                        {header.github && <span>• {header.github}</span>}
                    </div>
                </header>
            )}

            {/* Summary */}
            {summary && summary.content && (
                <section className="mb-8">
                    <h2 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-3">Summary</h2>
                    <p className="leading-relaxed text-gray-800">{summary.content}</p>
                </section>
            )}

            {/* Experience */}
            {experience && experience.items.length > 0 && (
                <section className="mb-8">
                    <h2 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-4">{experience.title}</h2>
                    <div className="space-y-6">
                        {experience.items.map((item) => (
                            <div key={item.id}>
                                <div className="flex justify-between items-baseline mb-1">
                                    <h3 className="font-bold text-lg">{item.role}</h3>
                                    <span className="text-sm text-gray-500">{item.duration}</span>
                                </div>
                                <div className="flex justify-between items-center mb-2">
                                    <span className="font-semibold text-gray-700">{item.company}</span>
                                    {item.location && <span className="text-sm text-gray-500">{item.location}</span>}
                                </div>
                                <p className="text-sm leading-relaxed text-gray-700 whitespace-pre-wrap">{item.description}</p>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Projects */}
            {projects && projects.items.length > 0 && (
                <section className="mb-8">
                    <h2 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-4">{projects.title}</h2>
                    <div className="space-y-4">
                        {projects.items.map((item) => (
                            <div key={item.id}>
                                <div className="flex justify-between items-baseline mb-1">
                                    <h3 className="font-bold">{item.name}</h3>
                                    {item.link && (
                                        <a href={item.link} target="_blank" rel="noreferrer" className="text-sm text-blue-600 hover:underline">
                                            {item.link}
                                        </a>
                                    )}
                                </div>
                                <p className="text-sm text-gray-700">{item.description}</p>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Education */}
            {education && education.items.length > 0 && (
                <section className="mb-8">
                    <h2 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-4">{education.title}</h2>
                    <div className="space-y-4">
                        {education.items.map((item) => (
                            <div key={item.id}>
                                <div className="flex justify-between items-baseline mb-1">
                                    <h3 className="font-bold">{item.school}</h3>
                                    <span className="text-sm text-gray-500">{item.duration}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-700">{item.degree}</span>
                                    {item.location && <span className="text-sm text-gray-500">{item.location}</span>}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Skills */}
            {skills && skills.items.length > 0 && (
                <section className="mb-8">
                    <h2 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-4">{skills.title}</h2>
                    <div className="flex flex-wrap gap-2">
                        {skills.items.map((item) => (
                            <span key={item.id} className="bg-gray-100 text-gray-800 px-3 py-1 rounded text-sm font-medium">
                                {item.name} {item.level && <span className="opacity-50 text-xs ml-1">• {item.level}</span>}
                            </span>
                        ))}
                    </div>
                </section>
            )}

            {/* Certifications */}
            {certifications && certifications.items.length > 0 && (
                <section className="mb-8">
                    <h2 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-4">{certifications.title}</h2>
                    <div className="space-y-2">
                        {certifications.items.map((item) => (
                            <div key={item.id} className="flex justify-between items-baseline">
                                <div>
                                    <span className="font-bold">{item.name}</span>
                                    <span className="text-gray-600 mx-2">—</span>
                                    <span className="text-gray-700">{item.issuer}</span>
                                </div>
                                <span className="text-sm text-gray-500">{item.date}</span>
                            </div>
                        ))}
                    </div>
                </section>
            )}
        </div>
    )
}

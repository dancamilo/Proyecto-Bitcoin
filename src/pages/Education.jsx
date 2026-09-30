import PageHeader from "@/components/ui-kit/PageHeader";
import Reveal from "@/components/ui-kit/Reveal";
import Tag from "@/components/ui-kit/Tag";
import EducationCard from "@/components/education/EducationCard";
import { getEducationTopics } from "@/services/dataService";

export default function Education() {
  const topics = getEducationTopics();
  return (
    <>
      <PageHeader
        eyebrow="Centro de aprendizaje"
        title="Entiende tus números"
        description="Conceptos clave explicados en pocas líneas. Toca una tarjeta para ampliarla."
        actions={<Tag>{topics.length} conceptos · 4 min</Tag>}
      />
      <div className="grid items-start gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
        {topics.map((t, i) => (
          <Reveal key={t.id} delay={0.04 * i} className={i === 0 ? "sm:col-span-2" : undefined}>
            <EducationCard topic={t} index={i} featured={i === 0} />
          </Reveal>
        ))}
      </div>
    </>
  );
}
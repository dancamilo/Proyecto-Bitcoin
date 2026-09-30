import Eyebrow from "@/components/ui-kit/Eyebrow";
import Reveal from "@/components/ui-kit/Reveal";

export default function PageHeader({ eyebrow, title, description, actions }) {
  return (
    <Reveal className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between lg:mb-10">
      <div className="max-w-2xl">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h1 className="text-title mt-3 font-semibold">{title}</h1>
        {description && <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground sm:text-base">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </Reveal>
  );
}
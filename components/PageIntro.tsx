export default function PageIntro({
  header,
  description,
}: {
  header: string;
  description: string;
}) {
  return (
    <section>
      <h1 className="text-2xl font-semibold tracking-tight">{header}</h1>
      <p className="text-muted-foreground">{description}</p>
      <hr className="my-4 text-muted-foreground" />
    </section>
  );
}

export function PrettyJSONFormatter({ data }: { data: any }) {
  const colorize = (jsonString: string) => {
    // Replace with colored spans
    return jsonString.replace(
      /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?)/g,
      (match) => {
        let color = "text-blue-600"; // number
        if (/^"/.test(match)) {
          color = "text-green-600"; // string
          if (/:$/.test(match)) {
            color = "text-red-600"; // key
          }
        } else if (/true|false/.test(match)) {
          color = "text-yellow-600"; // boolean
        } else if (/null/.test(match)) {
          color = "text-gray-600"; // null
        }
        return `<span class="${color}">${match}</span>`;
      }
    );
  };

  const formattedJSON = JSON.stringify(data, null, 2);
  const coloredJSON = colorize(formattedJSON);

  return (
    <pre
      className="w-fit rounded border bg-muted/50 p-4 font-mono text-xs"
      dangerouslySetInnerHTML={{ __html: coloredJSON }}
    />
  );
}

export function getFormattedDate(dateTimeString: string): string {
  // TODO: handle timezone stuff
  const date = new Date(dateTimeString);

  const day = date.getDate();
  const month = date.toLocaleString("default", { month: "long" });
  const year = date.getFullYear();

  return `${day} ${month} ${year}`;
}

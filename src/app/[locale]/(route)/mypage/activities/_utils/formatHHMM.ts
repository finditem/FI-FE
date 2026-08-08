const formatHHMM = (dateString: string) => {
  const fallback = "-";

  if (!dateString || !dateString.includes("T")) {
    return fallback;
  }

  const timePart = dateString.split("T")[1];

  const [hour, minute] = timePart.split(":");

  return `${hour}:${minute}`;
};

export default formatHHMM;

const config = {
  appName: "Apartment Life",
  appDescription:
    "More than just neighbors – we're a community that celebrates life's moments together, creating lasting connections and memorable experiences.",
  domainName:
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : "https://apartment-life.vercel.app",
};

export default config;

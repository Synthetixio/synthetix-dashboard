export default {
  API_BASE_URL:
    process.env.NODE_ENV === "development"
      ? "https://staging-api.havven.io/api/"
      : "https://api.havven.io/api/"
};


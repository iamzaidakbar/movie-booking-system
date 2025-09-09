const listenPort = async (app) => {
  try {
    app.listen(process.env.PORT, () => {
      console.log(`🚀 Server running on http://localhost:${process.env.PORT}`);
    });
  } catch (error) {
    console.error("❌ Server connection error:", error.message);
    process.exit(1); // Exit process with failure
  }
};

module.exports = listenPort;

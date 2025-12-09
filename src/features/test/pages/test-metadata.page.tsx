import usePageMetadata from "../../../hooks/use-page-metadata.hooks";

const TestMetadataPage = () => {
  // Test với metadata tùy chỉnh
  usePageMetadata({
    title: "Test Page",
    description: "Đây là trang test để kiểm tra hệ thống metadata",
    keywords: "test, metadata, soligant",
  });

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h1>Test Metadata Page</h1>
      <p>Trang này dùng để test hệ thống metadata.</p>

      <div
        style={{
          backgroundColor: "#f5f5f5",
          padding: "15px",
          borderRadius: "5px",
          marginTop: "20px",
        }}
      >
        <h3>Kiểm tra metadata:</h3>
        <p>• Mở Dev Tools (F12)</p>
        <p>• Xem thẻ &lt;title&gt; trong &lt;head&gt;</p>
        <p>• Xem meta description và keywords</p>
        <p>• So sánh với các trang khác</p>
      </div>

      <div style={{ marginTop: "20px" }}>
        <h3>JavaScript kiểm tra:</h3>
        <button
          onClick={() => {
            // Test metadata
          }}
          style={{
            padding: "10px 20px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Log Metadata to Console
        </button>
      </div>
    </div>
  );
};

export default TestMetadataPage;

import { CompleteIssueForList } from "@/lib/db";
import { Document, Page, Text, PDFViewer, Image } from "@react-pdf/renderer";

const PdfRenderer = ({ issues }: { issues: CompleteIssueForList[] }) => {
  return (
    <div className="w-full bg-white rounded-md shadow flex flex-col items-center">
      <div className="flex-1 w-full max-h-screen">
        <div>
          <PDFViewer width="100%" height="500">
            <Document>
              <Page size="A4">
                {issues?.map((issue) => {
                  const baseUrl =
                    "https://uploadthing-prod.s3.us-west-2.amazonaws.com/";
                  const photoUrl = issue?.photo?.url ?? "";
                  const path = photoUrl.replace(baseUrl, "");

                  return (
                    <div key={issue.id}>
                      <Image
                        src={{
                          uri: (path && `/img/${path}`) ?? "",
                          method: "GET",
                          body: "",
                          headers: {},
                          credentials: "omit",
                        }}
                      />
                      <Text>{issue?.issueTemplate?.name ?? "No name"}</Text>
                    </div>
                  );
                })}
              </Page>
            </Document>
          </PDFViewer>
        </div>
      </div>
    </div>
  );
};

export default PdfRenderer;

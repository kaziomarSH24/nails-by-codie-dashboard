import { useGetTermValueQuery } from "../../api/term-condiction-api/termCondiction";

export default function TermsAndConditions() {
  const {data} = useGetTermValueQuery({});
  console.log(data?.data, "term data")
  return (
    <div className=" px-4 py-12">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm  p-6 sm:p-10">

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Terms & Conditions
          </h1>
        </div>

        <p className="text-gray-500 mb-8">
          Last updated: {
            data?.data?.updatedAt
              ? new Date(data?.data.updatedAt).toLocaleDateString()
              : "N/A"
          }
        </p>

        {/* Section 1 */}
        <div className="mt-8 mb-6">
            <div
                className="prose max-w-none"
                dangerouslySetInnerHTML={{ __html: data?.data }}
            />
        </div>

        {/* Footer */}
        <div className="mt-10 pt-6 border-t text-sm text-gray-500">
          If you have any questions about these Terms, please contact our support team.
        </div>
      </div>
    </div>
  );
}
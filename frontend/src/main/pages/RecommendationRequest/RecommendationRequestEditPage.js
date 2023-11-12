import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { useParams } from "react-router-dom";
import RecommendationRequestForm from "main/components/RecommendationRequest/RecommendationRequestForm";
import { Navigate } from 'react-router-dom'
import { useBackend, useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";

export default function RecommendationRequestEditPage({storybook=false}) {
  let { id } = useParams();

  const { data: requests, _error, _status } =
    useBackend(
      // Stryker disable next-line all : don't test internal caching of React Query
      [`/api/recommendationrequests?id=${id}`],
      {  // Stryker disable next-line all : GET is the default, so changing this to "" doesn't introduce a bug
        method: "GET",
        url: `/api/recommendationrequests`,
        params: {
          id
        }
      }
    );


  const objectToAxiosPutParams = (requests) => ({
    url: "/api/recommendationrequests",
    method: "PUT",
    params: {
      id: requests.id,
    },
    data: {
      requesterEmail: requests.requesterEmail,
      professorEmail: requests.professorEmail,
      explanation: requests.explanation,
      dateRequested: requests.dateRequested,
      dateNeeded: requests.dateNeeded,
      done: requests.done
    }
  });

  const onSuccess = (requests) => {
    toast(`RecommendationRequest Updated - id: ${requests.id} from: ${requests.requesterEmail}`);
  }

  const mutation = useBackendMutation(
    objectToAxiosPutParams,
    { onSuccess },
    // Stryker disable next-line all : hard to set up test for caching
    [`/api/recommendationrequests?id=${id}`]
  );

  const { isSuccess } = mutation

  const onSubmit = async (data) => {
    mutation.mutate(data);
  }

  if (isSuccess && !storybook) {
    return <Navigate to="/recommendationrequest" />
  }

  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Edit RecommendationRequest</h1>
        {
          requests && <RecommendationRequestForm initialContents={requests} submitAction={onSubmit} buttonLabel="Update" />
        }
      </div>
    </BasicLayout>
  )
}
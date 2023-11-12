import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import RecommendationRequestForm from "main/components/RecommendationRequest/RecommendationRequestForm";
import { Navigate } from 'react-router-dom'
import { useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";

export default function RecommendationRequestCreatePage({storybook=false}) {

  const objectToAxiosParams = (requests) => ({
    url: "/api/recommendationrequests/post",
    method: "POST",
    params: {
      requesterEmail: requests.requesterEmail,
      professorEmail: requests.professorEmail,
      explanation: requests.explanation,
      dateRequested: requests.dateRequested,
      dateNeeded: requests.dateNeeded,
      done: requests.done
    }
  });

  const onSuccess = (requests) => {
    toast(`New recommendationRequest Created - id: ${requests.id} from: ${requests.requesterEmail}`);
  }

  const mutation = useBackendMutation(
    objectToAxiosParams,
     { onSuccess }, 
     // Stryker disable next-line all : hard to set up test for caching
     ["/api/recommendationrequests/all"]
     );

  const { isSuccess } = mutation

  const onSubmit = async (data) => {
    mutation.mutate(data);
  }

  if (isSuccess && !storybook) {
    return <Navigate to="/recommendationrequests" />
  }
  
  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Create New RecommendationRequest</h1>

        <RecommendationRequestForm submitAction={onSubmit} />

      </div>
    </BasicLayout>
  )
}

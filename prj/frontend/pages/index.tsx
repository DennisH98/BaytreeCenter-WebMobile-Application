import { ParentLayout } from "../components/layout/Layout"
import { Dashboard } from "../components/dashboard/Dashboard"
import { useAdminAccessPolicy } from "../util/auth/accessPolicyHook";


const IndexPage = () => {

  useAdminAccessPolicy();

  return(
  <ParentLayout>  
    <Dashboard />
  </ParentLayout>
)};

export default IndexPage

import PrivateRoute from "@/components/PrivateRoute.jsx";

export default function GovDashboard(){
    return(
        <PrivateRoute allowedRoles={["GOV"]}>
            <div className="p-6">
                <h1 className="text-2xl fonct-bold">Government Dashboard</h1>
            </div>
        </PrivateRoute>
    )
}
"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchKPIs,fetchLicenses, revokeLicense, prolongLicense, fetchActivities } from "@/services/api";
import { Card } from "@/components/Card";

export default function GovDashboard(){
    const queryClient = useQueryClient();

    const {data: kpis} = useQuery({
        queryKey: ["kpis"],
        queryFn: fetchKPIs,
    });

    const {data: licenses} = useQuery({
        queryKey: ["licenses"],
        queryFn: fetchLicenses,
    });

    const {data: activities} = useQuery({
        queryKey: ["activities"],
        queryFn: fetchActivities,
        refetchInterval: 5000
    });

    const revokeMutation = useMutation({
        mutationFn: revokeLicense,
        onSuccess: () =>{
            queryClient.invalidateQueries(["licenses"]);
        },
    });

    const prolongMutation = useMutation({
        mutationFn: prolongLicense,
        onSuccess: () =>{
            queryClient.invalidateQueries(["licenses"])
        },
    });

    return(
        <div className="p-6 space-y-6">
            <div className="grid grid-cols-3 gap-4">
                <Card title="Drug Types" value={kpis?.drugTypes || 0}/>
                <Card title="Valid Licenses" value={kpis?.validLicenses || 0}/>
                <Card title="Revoked Licenses" value={kpis?.revokeLicense || 0}/>
            </div>
            <div>
                <h2 className="text-xl font-semibold mb-2">Licenses</h2>
                <table className="w-full border">
                    <thead>
                        <tr className="bg-gray-100">
                            <th>Drug</th>
                            <th>Status</th>
                            <th>Expiry</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            licenses?.map((lic)=>(
                                <tr 
                                key={lic._id}
                                className="text-center border-t"
                                >
                                    <td>{lic.drugTypes}</td>
                                    <td>{lic.status}</td>
                                    <td>{lic.expiresAt}</td>
                                    <td className="space-x-2">
                                        <button
                                            className="bg-red-500 text-white px-2 py-1"
                                            onClick={() => revokeMutation.mutate(lic._id)}
                                        >
                                            Revoke
                                        </button>
                                        <button
                                            className="bg-blue-500 text-white px-2 py-1"
                                            onClick={() => prolongMutation.mutate(lic._id)}
                                        >
                                            Prolong
                                        </button>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>
            <div>
                <h2 className="text-xl font-semibold mb-2">Recent Activity</h2>
                <ul className="space-y-2">
                    {
                        activities?.map((act,i)=>(
                            <li key={i} className="border p-2">{act.message}</li>
                        ))
                    }
                </ul>
            </div>
        </div>
    )
}
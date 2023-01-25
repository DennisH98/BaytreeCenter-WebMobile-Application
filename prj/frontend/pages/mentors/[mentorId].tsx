import { useRouter } from 'next/router';
import { VStack, Box } from "@chakra-ui/react";
import MentorInformation from '../../components/mentors/mentorInformation';
import MentorSessions from '../../components/mentors/mentorSessions';
import { ParentLayout } from "../../components/layout/Layout"
import { apiGet } from '../../util/api';
import { ViewsMentorResponse } from '../../../shared/src/endpoints/viewsMentor';
import { useEffect, useState } from 'react';
import { ViewsMentorSessionsListResponse } from "../../../shared/src/endpoints/viewsMentorSessions";
import { ErrorResponseDisplay, LoadingSpinner } from '../../components/apiResponseHandler';
import { parseDateStrToDate } from '../../util/parseDate';
import { useAdminAccessPolicy } from "../../util/auth/accessPolicyHook";
export default function MentorInformationPage() {
    useAdminAccessPolicy();
    
    const router = useRouter();
    const mentorId = router.query.mentorId;

    const [mentor, setMentor] = useState<ViewsMentorResponse>();
    const [mentorIsLoading, setMentorIsLoading] = useState(true);
    const [mentorIsUnavailable, setMentorIsUnavailable] = useState(false);

    const [sessions, setSessions] = useState<ViewsMentorSessionsListResponse>([])
    const [sessionsIsLoading, setSessionsIsLoading] = useState(true);
    const [sessionsIsUnavailable, setSessionsIsUnavailable] = useState(false);

    useEffect(() => {
        if (!mentorId) {
            return;
        }
        apiGet<ViewsMentorResponse>("views/mentors/", mentorId.toString())
            .then((res) => {
                setMentor(res);
                setMentorIsLoading(false);
                setMentorIsUnavailable(false);
            })
            .catch((err) => {
                setMentorIsUnavailable(true);
                console.log(err);
            })
        apiGet<ViewsMentorSessionsListResponse>("views/sessions/", mentorId.toString())
            .then((res) => {
                setSessions(res);
                setSessionsIsLoading(false);
                setSessionsIsUnavailable(false);
            })
            .catch((err) => {
                setSessionsIsUnavailable(true);
                console.log(err);
            })
    }, [mentorId]);

    return (
        <ParentLayout>
            <VStack w="full" h="full" p={10} alignItems="" overflow="scroll">
                {mentorIsUnavailable ? <ErrorResponseDisplay /> : (mentorIsLoading ? <LoadingSpinner /> : <MentorInformation mentorInformation={mentor} />)}
                {sessionsIsUnavailable ? <ErrorResponseDisplay /> : (sessionsIsLoading ? <LoadingSpinner /> : <MentorSessions
                    mentorSessions={sessions} mentorStartDate={mentor ? parseDateStrToDate(mentor.startDate.toString()) : new Date}
                />)}
            </VStack>
        </ParentLayout>
    );
}
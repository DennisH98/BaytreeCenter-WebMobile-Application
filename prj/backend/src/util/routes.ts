import { Router } from "express";
import { Endpoint } from "../../../shared/src/endpoints";
import { testRouter } from "../endpoints/test";
import { mentorAccountsRouter } from "../endpoints/mentors/mentorAccounts";
import { mentorTypesRouter } from "../endpoints/mentorTypes";
import { notificationsRouter } from "../endpoints/notifications";
import { dashboardRouter } from "../endpoints/dashboard";
import { viewsMentorsRouter } from "../endpoints/mentors/viewsMentors";
import { viewsMenteesRouter } from "../endpoints/viewsMentees";
import { mentorAuthRouter } from "../endpoints/auth/mentors";
import { viewsSessionsRouter } from "../endpoints/sessions/viewsSessions";
import { mentorSchedulesRouter } from "../endpoints/mentors/mentorSchedules";
import { viewsSessionGroupsRouter } from "../endpoints/sessions/viewsSessionGroups";
import { viewsAllSessionsFromGroupRouter } from "../endpoints/sessions/viewsAllSessionsFromGroup";
import { mentorPasswordResetRouter } from "../endpoints/mentorPasswordReset";
import { discussionsRouter } from "../endpoints/discussions";
import { adminAuthRouter } from "../endpoints/auth/admin";

interface IRoute {
  endpoint: Endpoint;
  router: Router;
}

export const routes: IRoute[] = [
  {
    endpoint: Endpoint.TEST,
    router: testRouter,
  },
  {
    endpoint: Endpoint.ADMIN_AUTH,
    router: adminAuthRouter,
  },
  {
    endpoint: Endpoint.MENTOR_AUTH,
    router: mentorAuthRouter,
  },
  {
    endpoint: Endpoint.MENTOR_ACCOUNTS,
    router: mentorAccountsRouter,
  },
  {
    endpoint: Endpoint.VIEWS_MENTORS,
    router: viewsMentorsRouter,
  },
  {
    endpoint: Endpoint.VIEWS_MENTEES,
    router: viewsMenteesRouter,
  },
  {
    endpoint: Endpoint.VIEWS_SESSIONS,
    router: viewsSessionsRouter,
  },
  {
    endpoint: Endpoint.DASHBOARD_MENTORS,
    router: dashboardRouter,
  },
  {
    endpoint: Endpoint.SCHEDULES,
    router: mentorSchedulesRouter,
  },
  {
    endpoint: Endpoint.VIEWS_SESSIONGROUPS,
    router: viewsSessionGroupsRouter,
  },
  {
    endpoint: Endpoint.VIEWS_ALL_SESSIONS_FROM_GROUP,
    router: viewsAllSessionsFromGroupRouter,
  },
  {
    endpoint: Endpoint.MENTOR_TYPES,
    router: mentorTypesRouter,
  },
  {
    endpoint: Endpoint.NOTIFICATIONS,
    router: notificationsRouter,
  },
  {
    endpoint: Endpoint.MENTOR_PASSWORD_RESET,
    router: mentorPasswordResetRouter,
  },
  {
    endpoint: Endpoint.DISCUSSIONS,
    router: discussionsRouter
  }
];

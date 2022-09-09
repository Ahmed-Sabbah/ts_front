import {
  createRouter,
  createWebHistory
} from "vue-router";
import Dashboard from "../views/Dashboard/Dashboard.vue";
import Home from "../views/Dashboard/Home.vue";
import GatekeeperProfile from "../views/Dashboard/GatekeeperProfile.vue";
import ContributorProfile from "../views/Dashboard/ContributorProfile.vue";
import Setting from "../views/Dashboard/Setting.vue";
import ContactSupport from "../views/Dashboard/ContactSupport.vue";
import Contributors from "../views/Dashboard/Contributors/Contributors.vue";
import ViewContributor from "../views/Dashboard/Contributors/ViewContributor.vue";
import Archive from "../views/Dashboard/Archive.vue";
import Share from "../views/Dashboard/Share.vue";
import ViewerScreen from "../views/Dashboard/Viewer/ViewerScreen.vue";
import Media from "../views/Dashboard/Media/Media.vue";
import MediaUpload from "../views/Dashboard/Media/MediaUpload.vue";
import EditMedia from "../views/Dashboard/Media/EditMedia.vue";
import Albums from "../views/Dashboard/Albums/Albums.vue";
import ViewAlbum from "../views/Dashboard/Albums/ViewAlbum.vue";
import NewAlbum from "../views/Dashboard/Albums/NewAlbum.vue";
import EditAlbum from "../views/Dashboard/Albums/EditAlbum.vue";
import Memorials from "../views/Dashboard/Memorials/Memorials.vue";
import ViewMemorial from "../views/Dashboard/Memorials/ViewMemorial.vue";
import NewMemorial from "../views/Dashboard/Memorials/NewMemorial.vue";
import EditMemorial from "../views/Dashboard/Memorials/EditMemorial.vue";
import VisitMemorial from "../views/Dashboard/Memorials/VisitMemorial.vue";
import NewMemorialShare from "../views/Dashboard/Memorials/NewMemorialShare.vue";
import Journeys from "../views/Dashboard/Journeys/Journeys.vue";
import ViewJourney from "../views/Dashboard/Journeys/ViewJourney.vue";
import NewJourney from "../views/Dashboard/Journeys/NewJourney.vue";
import EditJourney from "../views/Dashboard/Journeys/EditJourney.vue";
import Collages from "../views/Dashboard/Collages/Collages.vue";
import ViewCollage from "../views/Dashboard/Collages/ViewCollage.vue";
import NewCollage from "../views/Dashboard/Collages/NewCollage.vue";
import EditCollage from "../views/Dashboard/Collages/EditCollage.vue";
import ViewerMedia from "../views/Dashboard/Viewer/ViewerMedia.vue";
import Auth from "../views/Auth/Auth.vue";
import SignUpGatekeeper from "../views/Auth/SignUpGatekeeper.vue";
import SignUpContributor from "../views/Auth/SignUpContributor.vue";
import SignUpVerification from "../views/Auth/SignUpVerification.vue";
import SignUpVerificationSuccessful from "../views/Auth/SignUpVerificationSuccessful.vue";
import Login from "../views/Auth/Login.vue";
import ResetPassword from "../views/Auth/ResetPassword.vue";
import ResetNewPassword from "../views/Auth/ResetNewPassword.vue";
import ResetNewPasswordSuccessful from "../views/Auth/ResetNewPasswordSuccessful.vue";
import Subscription from "../views/Auth/Subscription.vue";
import SubscriptionSuccessful from "../views/Auth/SubscriptionSuccessful.vue";
import TermsAndConditions from "../views/Auth/Terms.vue";
import NotFound from "../views/NotFound.vue";


const isLoggedIn = () => {
  return localStorage.getItem('auth_user_token')
}

const routes = [{
    path: "/Dashboard",
    name: "Dashboard",
    component: Dashboard,
    alias: "/",
    meta: {
      requiresAuth: true
    },
    beforeEnter: (to, from, next) => {
      if (isLoggedIn()) {
        next();
      } else {
        next('/Login');
      }
    },
    children: [{
        path: "",
        name: "Home",
        component: Home,
        meta: {
          layout: 'Dashboard',
          title: 'Dashboard'
        }
      },
      {
        path: "GatekeeperProfile",
        name: "GatekeeperProfile",
        component: GatekeeperProfile,
        meta: {
          layout: 'Dashboard',
          title: 'Profile'
        }
      },
      {
        path: "ContributorProfile",
        name: "ContributorProfile",
        component: ContributorProfile,
        meta: {
          layout: 'Dashboard',
          title: 'Profile'
        }
      },
      {
        path: "Setting",
        name: "Setting",
        component: Setting,
        meta: {
          layout: 'Dashboard',
          title: 'Settings'
        }
      },
      {
        path: "ContactSupport",
        name: "ContactSupport",
        component: ContactSupport,
        meta: {
          layout: 'Dashboard',
          title: 'ContactSupport'
        }
      },
      {
        path: "Contributors",
        name: "Contributors",
        component: Contributors,
        meta: {
          layout: 'Dashboard',
          title: 'Contributors'
        }
      },
      {
        path: "ViewContributor/:id",
        name: "ViewContributor",
        component: ViewContributor,
        meta: {
          layout: 'Dashboard',
          title: 'Contributors'
        }
      },
      {
        path: "Archive",
        name: "Archive",
        component: Archive,
        meta: {
          layout: 'Dashboard',
          title: 'Archive'
        }
      },
      {
        path: "Share",
        name: "Share",
        component: Share,
        meta: {
          layout: 'Dashboard',
          title: 'Share'
        }
      },
      {
        path: "Media/:type?/:id?/:commentID?",
        name: "Media",
        component: Media,
        meta: {
          layout: 'Dashboard',
          title: 'Media'
        },
      },
      {
        path: "MediaUpload",
        name: "MediaUpload",
        component: MediaUpload,
        meta: {
          layout: 'Dashboard',
          title: 'Upload Media'
        }
      },
      {
        path: "EditMedia/:id",
        name: "EditMedia",
        component: EditMedia,
        meta: {
          layout: 'Dashboard',
          title: 'Edit Media'
        }
      },
      {
        path: "Albums",
        name: "Albums",
        component: Albums,
        meta: {
          layout: 'Dashboard',
          title: 'Albums'
        }
      },
      {
        path: "ViewAlbum/:id",
        name: "ViewAlbum",
        component: ViewAlbum,
        meta: {
          layout: 'Dashboard',
          title: 'Album Name'
        }
      },
      {
        path: "NewAlbum",
        name: "NewAlbum",
        component: NewAlbum,
        meta: {
          layout: 'Dashboard',
          title: 'New Album'
        }
      },
      {
        path: "EditAlbum/:id",
        name: "EditAlbum",
        component: EditAlbum,
        meta: {
          layout: 'Dashboard',
          title: 'Edit Album'
        }
      },
      {
        path: "Memorials",
        name: "Memorials",
        component: Memorials,
        meta: {
          layout: 'Dashboard',
          title: 'Memorials'
        }
      },
      {
        path: "ViewMemorial/:id/:share?",
        name: "ViewMemorial",
        component: ViewMemorial,
        meta: {
          layout: 'Dashboard',
          title: 'Memorial Name'
        }
      },
      {
        path: "NewMemorial",
        name: "NewMemorial",
        component: NewMemorial,
        meta: {
          layout: 'Dashboard',
          title: 'New Memorial'
        }
      },
      {
        path: "EditMemorial/:id",
        name: "EditMemorial",
        component: EditMemorial,
        meta: {
          layout: 'Dashboard',
          title: 'Edit Memorial'
        }
      },
      {
        path: "NewMemorialShare/:id",
        name: "NewMemorialShare",
        component: NewMemorialShare,
        meta: {
          layout: 'Dashboard',
          title: 'Memorial Name'
        }
      },
      {
        path: "Journeys",
        name: "Journeys",
        component: Journeys,
        meta: {
          layout: 'Dashboard',
          title: 'Journeys'
        }
      },
      {
        path: "ViewJourney/:id",
        name: "ViewJourney",
        component: ViewJourney,
        meta: {
          layout: 'Dashboard',
          title: 'Journey Name'
        }
      },
      {
        path: "NewJourney",
        name: "NewJourney",
        component: NewJourney,
        meta: {
          layout: 'Dashboard',
          title: 'New Journey'
        }
      },
      {
        path: "EditJourney/:id",
        name: "EditJourney",
        component: EditJourney,
        meta: {
          layout: 'Dashboard',
          title: 'Edit Journey'
        }
      },
      {
        path: "Collages",
        name: "Collages",
        component: Collages,
        meta: {
          layout: 'Dashboard',
          title: 'Collages'
        }
      },
      {
        path: "ViewCollage/:id",
        name: "ViewCollage",
        component: ViewCollage,
        meta: {
          layout: 'Dashboard',
          title: 'Collage Name'
        }
      },
      {
        path: "NewCollage",
        name: "NewCollage",
        component: NewCollage,
        meta: {
          layout: 'Dashboard',
          title: 'New Collage'
        }
      },
      {
        path: "EditCollage/:id",
        name: "EditCollage",
        component: EditCollage,
        meta: {
          layout: 'Dashboard',
          title: 'Collage Name'
        }
      },
    ]
  },
  {
    path: "/ViewerScreen",
    query: {
      share_id: '',
      salt: '',
    },
    name: "ViewerScreen",
    component: ViewerScreen,
    meta: {
      title: 'Family Name'
    }
  },
  {
    path: "/ViewerMedia/:id/:page/:shareID",
    name: "ViewerMedia",
    component: ViewerMedia,
    meta: {
      title: 'Page Name'
    }
  },
  {
    path: "/VisitMemorial/:id",
    name: "VisitMemorial",
    component: VisitMemorial,
    meta: {
      title: 'Visit Memorial'
    }
  },
  {
    path: "/TermsAndConditions",
    name: "TermsAndConditions",
    component: TermsAndConditions,
  },
  {
    path: "/404",
    name: "NotFound",
    component: NotFound,
  },
  {
    path: "/",
    name: "Auth",
    component: Auth,
    children: [{
        path: "/SignUpGatekeeper",
        name: "SignUpGatekeeper",
        component: SignUpGatekeeper,
      },
      {
        path: "/SignUpContributor",
        name: "SignUpContributor",
        component: SignUpContributor,
      },
      {
        path: "/SignUpVerification",
        name: "SignUpVerification",
        component: SignUpVerification,
      },
      {
        path: "/SignUpVerificationSuccessful",
        name: "SignUpVerificationSuccessful",
        component: SignUpVerificationSuccessful,
      },
      {
        path: "/Login/:type?",
        name: "Login",
        component: Login,
      },
      {
        path: "/ResetPassword",
        name: "ResetPassword",
        component: ResetPassword,
      },
      {
        path: "/ResetNewPassword",
        query: {
          user: '',
          salt: '',
        },
        name: "ResetNewPassword",
        component: ResetNewPassword,
      },
      {
        path: "/ResetNewPasswordSuccessful",
        name: "ResetNewPasswordSuccessful",
        component: ResetNewPasswordSuccessful,
      },
      {
        path: "/Subscription",
        name: "Subscription",
        component: Subscription,
        meta: {
          requiresAuth: true
        },
      },
      {
        path: "/SubscriptionSuccessful",
        name: "SubscriptionSuccessful",
        component: SubscriptionSuccessful,
        meta: {
          requiresAuth: true
        },
      },
    ]
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  scrollBehavior() {
    return {
      top: 0
    }
  },
});

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !isLoggedIn()) {
    next('/Login');
  } else {
    next();
  }
});

export default router;
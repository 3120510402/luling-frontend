import React from "react";

import { Icon } from "@chakra-ui/react";
import {
  MdBarChart,
  MdPerson,
  MdHome,
  MdLock,
  MdCalendarToday,
  MdAddTask,
  MdNewspaper,
  MdPinDrop,
  MdCameraOutdoor,
  MdReport,
} from "react-icons/md";

// Admin Imports
import MainDashboard from "views/admin/default";
import Profile from "views/admin/profile";
import DataTables from "views/admin/dataTables";

// Auth Imports
import SignInCentered from "views/auth/signIn";
import Agenda from "views/admin/agenda";
import KategoriBerita from "views/admin/berita/kategori";
import Berita from "views/admin/berita/berita";
import BeritaEdit from "views/admin/berita/berita/edit";
import TipeLayananPublik from "views/admin/layananpublik/tipe";
import SubTipeLayananPublik from "views/admin/layananpublik/tipe/subtipe";
import PetaData from "views/admin/layananpublik/petadata";
import DetailPetaData from "views/admin/layananpublik/petadata/detail";
import CctvPage from "views/admin/layananpublik/cctv";
import PengaduanPage from "views/admin/pengaduan";
import PengaduanDetailPage from "views/admin/pengaduan/detail";
import DinasPengaduanPage from "views/dinas/pengaduan";
import DinasPengaduanDetailPage from "views/dinas/pengaduan/detail";
import DinasSektoralPage from "views/dinas/sektoral";
import SektoralFormPage from "views/dinas/sektoral/detail";

export const defaultRoutes = (roleId = 0) => [
  {
    name: "Main Dashboard",
    layout: "/admin",
    path: "/default",
    icon: <Icon as={MdHome} width="20px" height="20px" color="inherit" />,
    component: MainDashboard,
  },
  {
    name: "Agenda",
    category: true,
    visible: roleId === 1,
    items: [
      {
        name: "Agenda",
        layout: "/admin",
        path: "/agenda",
        icon: (
          <Icon
            as={MdCalendarToday}
            width="20px"
            height="20px"
            color="inherit"
          />
        ),
        component: Agenda,
      },
    ],
  },
  {
    name: "Berita",
    category: true,
    visible: roleId === 1,
    items: [
      {
        name: "Kategori",
        path: "/artikel/kategori-artikel",
        layout: "/admin",
        icon: (
          <Icon as={MdAddTask} width="20px" height="20px" color="inherit" />
        ),
        component: KategoriBerita,
      },
      {
        name: "Detail Artikel",
        path: "/artikel/detail/:id",
        layout: "/admin",
        visible: false,
        component: BeritaEdit,
      },
      {
        name: "Artikel",
        path: "/artikel/artikel",
        layout: "/admin",
        icon: (
          <Icon as={MdNewspaper} width="20px" height="20px" color="inherit" />
        ),
        component: Berita,
      },
    ],
  },

  // * =====================
  // * LAYANAN PUBLIK
  // * =====================

  {
    name: "Layanan Publik",
    category: true,
    visible: roleId === 1,
    items: [
      {
        name: "Sub Jenis",
        path: "/layanan-publik/jenis/:id",
        layout: "/admin",
        visible: false,
        icon: (
          <Icon as={MdPinDrop} width="20px" height="20px" color="inherit" />
        ),
        component: SubTipeLayananPublik,
      },
      {
        name: "Jenis",
        path: "/layanan-publik/jenis",
        layout: "/admin",
        icon: (
          <Icon as={MdPinDrop} width="20px" height="20px" color="inherit" />
        ),
        component: TipeLayananPublik,
      },
      {
        name: "Peta Data",
        path: "/layanan-publik/peta-data",
        layout: "/admin",
        icon: (
          <Icon as={MdPinDrop} width="20px" height="20px" color="inherit" />
        ),
        component: PetaData,
      },
      {
        name: "Detail Peta Data",
        visible: false,
        path: "/layanan-publik/peta-data-detail/:id",
        layout: "/admin",
        icon: (
          <Icon as={MdPinDrop} width="20px" height="20px" color="inherit" />
        ),
        component: DetailPetaData,
      },
      {
        name: "CCTV",
        path: "/layanan-publik/cctv",
        layout: "/admin",
        icon: (
          <Icon
            as={MdCameraOutdoor}
            width="20px"
            height="20px"
            color="inherit"
          />
        ),
        component: CctvPage,
      },
    ],
  },
  // * =====================
  // * PENGADUAN
  // * =====================

  {
    name: "Pengaduan",
    category: true,
    visible: roleId === 1,
    items: [
      {
        name: "Daftar Pengaduan",
        path: "/pengaduan/admin/list",
        layout: "/admin",
        icon: <Icon as={MdReport} width="20px" height="20px" color="inherit" />,
        component: PengaduanPage,
      },
      {
        name: "Detail Pengaduan",
        path: "/pengaduan/admin/detail/:id",
        visible: false,
        layout: "/admin",
        icon: <Icon as={MdReport} width="20px" height="20px" color="inherit" />,
        component: PengaduanDetailPage,
      },
    ],
  },
  {
    name: "Pengaduan",
    category: true,
    visible: roleId === 3,
    items: [
      {
        name: "Daftar Pengaduan",
        path: "/pengaduan/dinas/list",
        layout: "/admin",
        icon: <Icon as={MdReport} width="20px" height="20px" color="inherit" />,
        component: DinasPengaduanPage,
      },
      {
        name: "Detail Pengaduan",
        path: "/pengaduan/dinas/detail/:id",
        visible: false,
        layout: "/admin",
        icon: <Icon as={MdReport} width="20px" height="20px" color="inherit" />,
        component: DinasPengaduanDetailPage,
      },
    ],
  },
  {
    name: "Sektoral",
    category: true,
    visible: roleId === 3,
    items: [
      {
        name: "Daftar Data Sektoral",
        path: "/sektoral/dinas/list",
        layout: "/admin",
        icon: <Icon as={MdReport} width="20px" height="20px" color="inherit" />,
        component: DinasSektoralPage,
      },
      {
        name: "Detail Sektoral",
        path: "/sektoral/dinas/detail/:tahun/:bulan",
        visible: false,
        layout: "/admin",
        icon: <Icon as={MdReport} width="20px" height="20px" color="inherit" />,
        component: SektoralFormPage,
      },
    ],
  },
  {
    name: "Sign In",
    layout: "/auth",
    visible: false,
    path: "/sign-in",
    icon: <Icon as={MdLock} width="20px" height="20px" color="inherit" />,
    component: SignInCentered,
  },
];

export default defaultRoutes();

import { SideBarItemType } from "../../interfaces/sidebar-items";
import {AiFillHome, AiFillNotification, AiOutlinePoweroff} from "react-icons/ai"
import {ImStatsDots} from "react-icons/im"
import {FaUserPlus, FaRegListAlt} from "react-icons/fa"
import {CgUserList} from "react-icons/cg"
import {logoutButton} from "./logoutButton";

export const sidebarItems: SideBarItemType[] = [
    {
      type: 'link',
      href: '/',
      label: 'Home',
      icon: AiFillHome
    },
    {
      type: 'link',
      href: '/accounts',
      label: 'Mentor Accounts',
      icon: FaUserPlus
    },

    {
      type: 'link',
      href: '/notifications',
      label: 'Notifications',
      icon: AiFillNotification
    },

    {
      type: 'link',
      href: '/mentors',
      label: 'Mentors',
      icon: CgUserList
    },

    {
      type: 'callback',
      handleClick: logoutButton,
      label: 'Logout',
      icon: AiOutlinePoweroff,
      contextRequest: 'logout'
    }

    //Headings if needed to seperate sections
    // {
    //   type: 'header',
    //   label: 'Settings'
    // },

    
  ];
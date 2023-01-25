import { IconType } from "react-icons/lib";

type HeaderItem = {
    type: 'header';
};

type LinkItem = {
    type: 'link';
    href: string;
    icon: IconType;
};
  
type CallbackItem = {
    type: 'callback';
    handleClick: Function;
    icon: IconType;
    contextRequest: String;
}

//Makes sure that link items have href and icon
type ItemTypeProps = HeaderItem | LinkItem | CallbackItem;
 
//and heading and link item have labels
export type SideBarItemType = ItemTypeProps & {
    label: string;
    contextRequest?: string;
};


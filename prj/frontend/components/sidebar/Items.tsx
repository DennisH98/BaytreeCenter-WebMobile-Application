import NextLink from 'next/link';
import { Heading, Text, Link, HStack, Icon } from '@chakra-ui/react';
import { SideBarItemType } from '../../interfaces/sidebar-items';
import { useRouter } from "next/router";
import { useAuth } from '../../contexts/auth';


type Props = {
    item: SideBarItemType;
    contextCallback?: Function;
}

export function fulfillContextCallback(item: SideBarItemType){
    if(item.contextRequest == 'logout'){
        return useAuth().logout;
    }
    return null;
}

export const SideBarItem = ({item, contextCallback}:Props, ) => {
    const { label } = item;
    //Conditional logic to render different items (i.e header or link items)
    if(item.type === 'link'){
        const {href} = item;
        const {icon} = item;
        return(
            <NextLink href={href} passHref >
                <Link>
                    <HStack>
                        <Icon
                         as= {icon}
                         m="20px"
                        />

                        <Text
                         fontSize="large"
                         fontWeight="medium"
                         letterSpacing="wide"
                         m="20px"
                         color={"#000000"}
                        >
                         {label}
                        </Text>
                    </HStack>
                </Link>
            </NextLink>
        )
    }
    if(item.type === 'callback'){
        const {icon} = item;
        const {handleClick} = item;
        return(
            <button onClick={(event: React.MouseEvent<HTMLElement>) => 
            handleClick(contextCallback)} >
                <HStack>
                    <Icon 
                        as= {icon} 
                        m="20px" 
                    />
                    <Text
                        fontSize="large"
                        fontWeight="medium"
                        letterSpacing="wide"
                        m="20px"
                        color={"#000000"}
                    >
                        {label}
                    </Text>
                </HStack>
            </button>
        )
    }
    //If not type link Heading will display instead
    return (
        <Heading>
            {label}
        </Heading>
    );

};
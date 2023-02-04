import React, {FC} from 'react';
import {Button, Navbar} from 'react-bulma-components';
import Icon from '@mdi/react';
import {mdiAccount, mdiLogoutVariant} from '@mdi/js';
import {useTranslation} from 'react-i18next';
import {useAppContext} from "../appContext";

interface LogInButtonProps {
    inNavBar: boolean,
}

const LogInButton: FC<LogInButtonProps> = ({inNavBar}) => {
    const { t } = useTranslation();
    const { authState: { auth, osmUsername }, handleLogIn, handleLogOut } = useAppContext();

    if (auth != null && auth.authenticated()) {
        return (
            <Navbar.Item className="has-text-white" hoverable={true}>
                <Navbar.Item>
                <Icon className="icon mr-2"  path={mdiAccount} size={1.0}/>
               {osmUsername}
                </Navbar.Item>
                <Navbar.Dropdown className='has-background-green'>
                    <Navbar.Item onClick={handleLogOut}>
                    <Icon path={mdiLogoutVariant} size={1.3} className="icon mr-2"/>
                        {t("navbar.logout")}
                    </Navbar.Item>
                </Navbar.Dropdown>
            </Navbar.Item>
        )
    } else {
        return (
            <Navbar.Item renderAs='div' p={1}>
                <Button color={inNavBar ? "white" : undefined} outlined={true} onClick={handleLogIn}>
                    {t("navbar.login")}
                </Button>
            </Navbar.Item>
        )
    }
};

export default LogInButton;
import React, {FC} from 'react';
import {Button, Icon, Navbar} from 'react-bulma-components';
import {mdiAccount, mdiLogout} from '@mdi/js';
import {useTranslation} from 'react-i18next';
import {useAppContext} from "../appContext";

interface LogInButtonProps {
    inNavBar: boolean,
}

const LogInButton: FC<LogInButtonProps> = ({inNavBar}) => {
    const { t } = useTranslation();
    const { authState: { auth, osmUsername }, handleLogIn, handleLogOut } = useAppContext();

    if (auth.authenticated()) {
        return (
            <Navbar.Item hoverable={true}>
                <Navbar.Item>
                    <Icon icon={mdiAccount} size='2rem' mr={1} />
                    {osmUsername}
                </Navbar.Item>
                <Navbar.Dropdown className='has-background-green'>
                    <Navbar.Item onClick={handleLogOut}>
                        <Icon icon={mdiLogout} size='2rem' mr={1} />
                        {t("navbar.logout")}
                    </Navbar.Item>
                </Navbar.Dropdown>
            </Navbar.Item>
        )
    } else {
        return (
            <Navbar.Item renderAs='div' p={1}>
                <Button color={inNavBar ? "white" : undefined} outlined={true} onClick={handleLogIn}>{t("navbar.login")}</Button>
            </Navbar.Item>
        )
    }
};

export default LogInButton;
import {FC, useState} from 'react';
import {Button, Icon, Navbar} from 'react-bulma-components';
import { mdiAccount, mdiLogout } from '@mdi/js';
import { useTranslation } from 'react-i18next';
import { updateOsmUsernameState } from '../osm';
import React from "react";

const Login: FC<LoginProps> = ({ auth }) => {
    const { t } = useTranslation();

    const [authenticated, setAuthenticated] = useState(auth.authenticated());
    const [osmUsername, setOsmUsername] = useState("");

    function login() {
        auth.authenticate(() => {
            updateOsmUsernameState(auth, setOsmUsername);
            setAuthenticated(true);
        })
    }

    function logout() {
        auth.logout();
        setAuthenticated(false);
    }

    if (authenticated) {
        updateOsmUsernameState(auth, setOsmUsername);
        return (
            <Navbar.Item hoverable={true}>
                <Navbar.Item>
                    <Icon icon={mdiAccount} size='2rem' mr={1} />
                    {osmUsername}
                </Navbar.Item>
                <Navbar.Dropdown className='has-background-green'>
                    <Navbar.Item onClick={logout}>
                        <Icon icon={mdiLogout} size='2rem' mr={1} />
                        {t("navbar.logout")}
                    </Navbar.Item>
                </Navbar.Dropdown>
            </Navbar.Item>
        )
    } else {
        return (
            <Navbar.Item renderAs='div' p={1}>
                <Button color={"white"} outlined={true} onClick={login}>{t("navbar.login")}</Button>
            </Navbar.Item>
        )
    }
};

interface LoginProps {
    auth: any, // TODO: typing
}

export default Login;
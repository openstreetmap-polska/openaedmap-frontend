import Icon from '@mdi/react';
import { osmAuth } from 'osm-auth';
import { useState } from 'react';
import { Button, Navbar } from 'react-bulma-components';
import { mdiAccount, mdiLogout } from '@mdi/js';
import { useTranslation } from 'react-i18next';


function updateOsmUsernameState(auth, setter) {
    auth.xhr(
        { method: "GET", path: "/api/0.6/user/details" },
        function (err, result) {
            // result is an XML DOM containing the user details
            if (err) {
                console.log(err);
                throw err;
            }
            const userObject = result.getElementsByTagName('user')[0];
            setter(userObject.getAttribute('display_name'));
        }
    );
}


export default function Login() {

    const { REACT_APP_OSM_API_URL, REACT_APP_OSM_OAUTH2_CLIENT_ID, REACT_APP_OSM_OAUTH2_CLIENT_SECRET } = process.env;
    const { t } = useTranslation();
    const redirectPath = window.location.origin + window.location.pathname;
    // should this use useState ?
    // eslint-disable-next-line no-unused-vars
    const [auth, setAuth] = useState(
        osmAuth({
            url: REACT_APP_OSM_API_URL,
            client_id: REACT_APP_OSM_OAUTH2_CLIENT_ID,
            client_secret: REACT_APP_OSM_OAUTH2_CLIENT_SECRET,
            redirect_uri: redirectPath + "land.html",
            scope: "read_prefs",
            auto: false,
            singlepage: false,
        })
    )
    const [authenticated, setAuthenticated] = useState(auth.authenticated())
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
                <Navbar.Item textColor='white'>
                    <Icon path={mdiAccount} size='2rem' mr={1} />
                    {osmUsername}
                </Navbar.Item>
                <Navbar.Dropdown className='has-background-green'>
                    <Navbar.Item textColor='white' onClick={logout}>
                        <Icon path={mdiLogout} size='2rem' mr={1} />
                        {t("navbar.logout")}
                    </Navbar.Item>
                </Navbar.Dropdown>
            </Navbar.Item>
        )
    } else {
        return (
            <Navbar.Item px={1}>
                <Button color={"white"} outlined={true} onClick={login}>{t("navbar.login")}</Button>
            </Navbar.Item>
        )
    }
}

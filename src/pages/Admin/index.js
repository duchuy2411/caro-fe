import {Admin, jsonServerRestClient, fetchUtils, Resource} from "admin-on-rest";
import {UserList} from "./users";
import auth from './auth/index';
import PeopleIcon from "@material-ui/icons/People";

const httpClient = (url, options = {}) => {
    if (!options.headers) {
        options.headers = new Headers({ Accept: 'application/json' });
    }
    const token = localStorage.getItem('token');
    options.headers.set('Authorization', `Bearer ${token}`);
    return fetchUtils.fetchJson(url, options);
}

export default (props) => (
    <Admin restClient={jsonServerRestClient('http://localhost:8000/admin', httpClient)} authClient={auth}>
        <Resource name="users" list={UserList} icon={PeopleIcon}/>
    </Admin>
);
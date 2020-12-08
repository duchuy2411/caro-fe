import { React } from 'react';
import { List, Datagrid, TextField } from 'admin-on-rest';

export const UserList = (props) => {
    return (
        <List {...props}>
            <Datagrid>
                <TextField source="id"/>
                <TextField source="username" />
                <TextField source="email" />
                <TextField source="displayname"/>
            </Datagrid>
        </List>
    );
}
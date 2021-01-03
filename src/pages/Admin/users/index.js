import { React } from 'react';
import { List, Datagrid, TextField, EditButton, DeleteButton, Show, SimpleShowLayout, Edit, Filter, TextInput  } from 'admin-on-rest';

const UserFilter = (props) => (
    <Filter {...props}>
        <TextInput label="Tìm kiếm" source="q" alwaysOn/>
    </Filter>
);

export const UserList = (props) => {
    return (
        <List {...props} filters={<UserFilter/>}>
            <Datagrid>
                <TextField source="id"/>
                <TextField source="username" />
                <TextField source="email" />
                <TextField source="displayname" label="Tên"/>
                <EditButton/>
                <DeleteButton/>
            </Datagrid>
        </List>
    );
}

export const UserShow = (props) => (
    <Show {...props}>
        <SimpleShowLayout>
            <TextField source="id"/>
            <TextField source="username"/>
            <TextField source="displayname" label="Họ tên"/>
            <TextField source="email"/>
            <TextField source="cup"/>
            <TextField source="total_match" label="Tổng số trận"/>
            <TextField source="win_match" label="Số trận thắng"/>
            <TextField source="win_percent" label="Tỷ lệ thắng"/>
        </SimpleShowLayout>
    </Show>
)

export const UserEdit = (props) => (
    <Edit {...props}>
        <SimpleShowLayout>
            <TextField source="id"/>
            <TextField source="username"/>
            <TextField source="displayname" label="Họ tên"/>
            <TextField source="email"/>
            <TextField source="cup"/>
            <TextField source="total_match" label="Tổng số trận"/>
            <TextField source="win_match" label="Số trận thắng"/>
            <TextField source="win_percent" label="Tỷ lệ thắng"/>
        </SimpleShowLayout>
    </Edit>
)
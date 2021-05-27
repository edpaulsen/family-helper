import React from 'react';
import List from "./List";
import {Item} from "semantic-ui-react";

function Lists({ lists }) {
    return (
        <div>
            <Item.Group>
                {lists.map((item) => (
                    <List key={item.id} {...item}>
                        {item.title}
                    </List>
                ))}
            </Item.Group>
        </div>
    );
}

export default Lists;
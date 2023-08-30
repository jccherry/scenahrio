from anytree import Node, RenderTree
import json

class MessageNode(Node):
    _alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz" * 10
    _index = 0

    def __init__(self, name, parent=None, user_type=None):
        if parent:
            parent_id = parent.id
            self.id = parent_id + self._alphabet[len(parent.children)]
        else:
            self.id = self._alphabet[self._index]
            self._index += 1
        self.user_type = user_type
        super().__init__(name, parent=parent)

    def create_child_nodes(self, messages_list = [], next_user_type = "HR"):
        for message in messages_list:
            child = MessageNode(message, parent = self, user_type = next_user_type)

    def concatenate_messages_to_root(self):
        return [f"{node.user_type}: '{node.message}'" for node in self.ancestors] + [f"{self.user_type}: '{self.message}'"]

    @property
    def message(self):
        return self.name
    
    @message.setter
    def message(self, value):
        self.name = value

    def __repr__(self):
        ret = ""
        for pre, _, node in RenderTree(self):
            ret += f"{pre}(Node (Id {node.id}) (User_type {node.user_type})\n{pre} (Message {node.message}))\n"
        return ret
    
    def to_json(self):
        data = self._node_to_dict()
        return json.dumps(data, indent=2)

    @classmethod
    def from_json(cls, json_str):
        data = json.loads(json_str)
        return cls._node_from_dict(data)

    def _node_to_dict(self):
        return {
            "message": self.message,
            "id": self.id,
            "user_type": self.user_type,
            "children": [child._node_to_dict() for child in self.children]
        }

    @classmethod
    def _node_from_dict(cls, data, parent=None):
        node = cls(data["message"], parent=parent, user_type=data["user_type"])
        for child_data in data["children"]:
            cls._node_from_dict(child_data, parent=node)
        return node
    
    # Use DFS to find the node with the ID
    def find_node_by_id(self, id):
        # If the current node's ID matches the target ID, return this node
        if self.id == id:
            return self
        
        # Traverse the subtree and its descendants to find the matching ID
        for child in self.children:
            result = child.find_node_by_id(id)
            if result is not None:
                return result
            
        # base case if nothing is found
        return None
    
if __name__ == "__main__":
    a = MessageNode("Hello World",None,"HR")
    b = MessageNode("MSGB",a,"Employee")
    c = MessageNode("MSGC",a,"Employee")
    ca = MessageNode("ABAASDASD",c,"HR")
    cb = MessageNode("JJJJJ",c, "HR")
    d = MessageNode("AC",a,"Employee")

    print(a)
    print("=============================")
    print(cb.concatenate_message_to_root())

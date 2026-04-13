def user_doc_to_response(doc: dict) -> dict:
    # MongoDB auto-inserts _id as a non-JSON-serializable ObjectId — must strip before returning
    doc.pop("_id", None)
    doc.pop("password", None)
    doc.setdefault("followed_users", [])
    doc.setdefault("closet", [])
    return doc


def post_doc_to_dict(doc: dict) -> dict:
    doc.pop("_id", None)
    return doc

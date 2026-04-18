import hashlib

def get_embedding(text):
    # simple deterministic embedding (no API)
    hash_object = hashlib.md5(text.encode())
    hash_hex = hash_object.hexdigest()

    # convert hex to numbers
    embedding = [int(hash_hex[i:i+2], 16) for i in range(0, len(hash_hex), 2)]
    
    return embedding


 
# node-red-contrib-hunterio
Provide nodes to call hunterio API.

## hunterio-config node
Add your api key for hunterio

## hunterio-execute node
Execute api calls. In msg.payload, provide two props:
- method: 
- args: 


## Example
Input format should be:
```json
{
    payload: {
        method: "domainSearch",
        args: {
            domain: "apple.com"
        }
    }
}
```

Output msg.payload contains the result of your query.
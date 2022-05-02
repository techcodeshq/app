# Changes

1. All `member` -> `user` also changed all the relations
  - eg `MemberComponent` -> `UserComponent`, `/members/:id` -> `/users/:id`
2. All `memberId` -> `userId`
3. Perm `MANAGE_MEMBERS` -> `MANAGE_USERS`

4. API `PATCH /members/metadata` -> `PATCH /users/metadata` (i find every other members/\*\* route not used and they're deleted)

# TODO:

- Branch managers are able to go to `/branch/[slug]/members/[member-id]` and edit other people's statistics -- make it so anywith perms can also do it

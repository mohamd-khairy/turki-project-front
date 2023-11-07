<script setup>
import avatar1 from '@images/avatars/avatar-1.png'

const user = JSON.parse(localStorage.getItem('najdUser'))

console.log('User', user)
</script>

<template>
  <VBadge
    dot
    location="bottom right"
    offset-x="3"
    offset-y="3"
    bordered
    color="success"
  >
    <VAvatar
      class="cursor-pointer"
      color="primary"
      variant="tonal"
    >
      <VImg :src="user.avatar ?? avatar1" v-if="user.avatar" />
      <VIcon icon="iconoir:n-square" size="32" v-else></VIcon>

      <!-- SECTION Menu -->
      <VMenu
        activator="parent"
        width="230"
        location="bottom end"
        offset="14px"
      >
        <VList>
          <!-- 👉 User Avatar & Name -->
          <VListItem>
            <template #prepend>
              <VListItemAction start>
                <VBadge
                  dot
                  location="bottom right"
                  offset-x="3"
                  offset-y="3"
                  color="success"
                >
                  <VAvatar
                    color="primary"
                    variant="tonal"
                  >
                    <VImg :src="user.avatar ?? avatar1" v-if="user.avatar" />
                    <VIcon icon="iconoir:n-square" size="32" v-else></VIcon>
                  </VAvatar>
                </VBadge>
              </VListItemAction>
            </template>

            <VListItemTitle class="font-weight-semibold">
              {{ user.username ?? "مستخدم نجدي" }}
            </VListItemTitle>
            <VListItemSubtitle>
              <VIcon icon="octicon:dot-fill-24" :color="user.is_active == true ? '#008000' : '#f00000'" size="16"></VIcon>
              <span class="mx-1">
                {{ user.is_active == true ? 'نشط' : 'غير نشط' }}
              </span>
            </VListItemSubtitle>
          </VListItem>

          <VDivider class="my-2" />

          <!-- 👉 Profile -->
<!--          <VListItem link>-->
<!--            <template #prepend>-->
<!--              <VIcon-->
<!--                class="me-2"-->
<!--                icon="tabler-user"-->
<!--                size="22"-->
<!--              />-->
<!--            </template>-->

<!--            <VListItemTitle>Profile</VListItemTitle>-->
<!--          </VListItem>-->

          <!-- 👉 Settings -->
<!--          <VListItem link>-->
<!--            <template #prepend>-->
<!--              <VIcon-->
<!--                class="me-2"-->
<!--                icon="tabler-settings"-->
<!--                size="22"-->
<!--              />-->
<!--            </template>-->

<!--            <VListItemTitle>Settings</VListItemTitle>-->
<!--          </VListItem>-->

          <!-- 👉 Pricing -->
<!--          <VListItem link>-->
<!--            <template #prepend>-->
<!--              <VIcon-->
<!--                class="me-2"-->
<!--                icon="tabler-currency-dollar"-->
<!--                size="22"-->
<!--              />-->
<!--            </template>-->

<!--            <VListItemTitle>Pricing</VListItemTitle>-->
<!--          </VListItem>-->

          <!-- 👉 FAQ -->
<!--          <VListItem link>-->
<!--            <template #prepend>-->
<!--              <VIcon-->
<!--                class="me-2"-->
<!--                icon="tabler-help"-->
<!--                size="22"-->
<!--              />-->
<!--            </template>-->

<!--            <VListItemTitle>FAQ</VListItemTitle>-->
<!--          </VListItem>-->

          <!-- Divider -->
<!--          <VDivider class="my-2" />-->

          <!-- 👉 Logout -->
          <VListItem to="/login">
            <template #prepend>
              <VIcon
                class="me-2"
                icon="tabler-logout"
                size="22"
              />
            </template>

            <VListItemTitle>تسجيل الخروج</VListItemTitle>
          </VListItem>
        </VList>
      </VMenu>
      <!-- !SECTION -->
    </VAvatar>
  </VBadge>
</template>

Rails.application.routes.draw do
  devise_for :users, controllers: {
    confirmations: 'users/confirmations',
    passwords: 'users/passwords',
    registrations: 'users/registrations',
    sessions: 'users/sessions',
    unlocks: 'users/unlocks'
  }
  mount LetterOpenerWeb::Engine, at: '/letter_opener' if Rails.env.development?

  post 'uploads/user_avatar' => 'uploads#create_user_avatar'
  delete 'uploads/user_avatar' => 'uploads#delete_user_avatar'

  resources :users
  resources :organizations, param: :slug, except: [:update, :destroy] do
    post :create_members
    get :add_members
    get :delete
  end
  put '/organizations/:slug/grant_admin/:user_uuid',    to: 'organizations#grant_admin',    as: 'organization_grant_admin'
  put '/organizations/:slug/revoke_admin/:user_uuid',   to: 'organizations#revoke_admin',   as: 'organization_revoke_admin'
  delete '/organizations/:slug/remove_member/:user_uuid',  to: 'organizations#remove_member',  as: 'organization_remove_member'

  root 'home#index'
end

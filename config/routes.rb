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
  resources :organizations, param: :slug, except: [:update, :edit, :destroy] do
    post :create_members
    post :destroy
    get :add_members
    get :delete
    delete :leave
  end
  get '/organizations/:slug/accept_invitation/:confirmation_token', to: 'organizations#accept_invitation', as: 'organization_accept_invitation'
  put '/organizations/:slug/grant_admin/:user_uuid',    to: 'organizations#grant_admin',    as: 'organization_grant_admin'
  put '/organizations/:slug/revoke_admin/:user_uuid',   to: 'organizations#revoke_admin',   as: 'organization_revoke_admin'
  delete '/organizations/:slug/remove_member/:user_uuid',  to: 'organizations#remove_member',  as: 'organization_remove_member'

  resources :projects, param: :key do
    get :delete
    post :destroy
  end

  get '/user/:username', to: 'user_profiles#show', as: 'user_profile'

  root 'projects#index'

  namespace :api do
    namespace :internal do
      resources :columns, param: :uuid
    end
  end
end

Rails.application.routes.draw do
  devise_for :users, controllers: {
    confirmations: 'users/confirmations',
    passwords: 'users/passwords',
    registrations: 'users/registrations',
    sessions: 'users/sessions',
    unlocks: 'users/unlocks'
  }
  mount LetterOpenerWeb::Engine, at: '/letter_opener' if Rails.env.development?

  resources :health, only: [:index]

  resources :organizations, param: :slug, except: [:update, :edit, :destroy] do
    post :create_members
    post :destroy
    get :add_members
    get :delete
    delete :leave

    get 'accept_invitation/:confirmation_token', action: :accept_invitation, as: 'accept_invitation'
    put 'grant_admin/:user_uuid', action: :grant_admin, as: 'grant_admin'
    put 'revoke_admin/:user_uuid', action: :revoke_admin, as: 'revoke_admin'
    delete 'remove_member/:user_uuid', action: :remove_member, as: 'remove_member'
  end

  resources :projects, param: :key do
    get :delete
    resources :boards, param: :slug, only: [:show]
    post :destroy
  end

  resources :users
  resources :user_profiles, path: 'user', param: :username, only: :show

  root 'projects#index'

  namespace :admin do
    resources :users, param: :uuid
  end

  namespace :api, path: 'api/v:api_version', defaults: { format: :json } do
    namespace :internal do
      resources :columns, param: :uuid
      resources :cards, param: :uuid do
        post :create_board
      end

      resources :boards, param: :slug do
        put :reorder_columns
        put :reorder_cards
      end

      resources :card_items, param: :uuid

      resource :user_avatars, only: [:create, :destroy]
    end
  end
end

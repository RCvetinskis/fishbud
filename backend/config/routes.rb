Rails.application.routes.draw do
  get '/current_user', to: 'current_user#index'
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Defines the root path route ("/")
  # root "articles#index"
  devise_for :users, path: '', path_names: {
                                 sign_in: 'login',
                                 sign_out: 'logout',
                                 registration: 'signup'
                               },
                     controllers: {
                       sessions: 'users/sessions',
                       registrations: 'users/registrations'
                     }
  namespace :users do
    post 'refresh', to: 'auth#refresh'
    get 'me', to: 'auth#me'
  end

  namespace :statistics do
    resources :weather, only: [:index]

    resources :catches, only: [:index] do
      collection do
        get :top_catches
        get :top_fishing_trips
      end
    end
  end

  resources :fish, only: [:index]

  resources :lakes, only: %i[index show] do
    collection { get :suggest }
    member do
      get :lake_statistics
    end

    get :catches, to: 'catches#lake_catches'
    get :fishing_trips, to: 'fishing_trips#lake_fishing_trips'
  end

  resources :catches, only: %i[create]

  resources :fishing_trips, only: %i[create update] do
    collection do
      get :active
    end
  end

  resources :spots, only: %i[index create] do
    collection { get :suggest }
  end
end

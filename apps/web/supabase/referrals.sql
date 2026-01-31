-- Add Referral Columns
alter table public.profiles
add column if not exists referral_code text unique,
add column if not exists referred_by uuid references public.profiles(id);

-- Ensure clout_score exists (idempotent check)
-- (It should already be there from previous phases)

-- Function to generate unique referral code
create or replace function generate_unique_referral_code()
returns text as $$
declare
  chars text[] := '{A,B,C,D,E,F,G,H,J,K,L,M,N,P,Q,R,S,T,U,V,W,X,Y,Z,2,3,4,5,6,7,8,9}';
  new_code text;
  done bool;
begin
  done := false;
  while not done loop
    new_code := 'RAWR-';
    for i in 1..6 loop
      new_code := new_code || chars[1+floor(random()*array_length(chars, 1))];
    end loop;
    
    -- Check uniqueness
    perform 1 from public.profiles where referral_code = new_code;
    if not found then
      done := true;
    end if;
  end loop;
  return new_code;
end;
$$ language plpgsql;

-- Update handle_new_user to include referral logic
create or replace function public.handle_new_user()
returns trigger as $$
declare
  referrer_id uuid;
  input_referral_code text;
begin
  input_referral_code := new.raw_user_meta_data->>'referral_code';
  
  -- Find referrer if code provided
  if input_referral_code is not null then
    select id into referrer_id from public.profiles where referral_code = input_referral_code;
  end if;

  insert into public.profiles (id, full_name, phone_number, avatar_url, referral_code, referred_by, clout_score)
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'phone_number',
    new.raw_user_meta_data->>'avatar_url',
    generate_unique_referral_code(), -- Generate their own code
    referrer_id,
    case when referrer_id is not null then 100 else 0 end -- Bonus for being recruited
  );

  -- Award Clout to Referrer (500 pts)
  if referrer_id is not null then
    update public.profiles
    set clout_score = coalesce(clout_score, 0) + 500
    where id = referrer_id;
    
    -- Optional: Insert into live_events for the timeline?
    insert into public.live_events (type, meta)
    values ('signup', jsonb_build_object('message', 'A new recruit joined via referral.'));
  else
     insert into public.live_events (type, meta)
    values ('signup', jsonb_build_object('message', 'A new recruit joined the pack.')); 
  end if;

  return new;
end;
$$ language plpgsql security definer;

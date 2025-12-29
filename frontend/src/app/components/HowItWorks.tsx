import { Calendar, MapPin, Utensils } from 'lucide-react';

export function HowItWorks() {
  const steps = [
    {
      number: '01',
      title: '幹事がイベントを作成',
      description: 'イベント名、参加人数、候補日時を設定します。',
      icon: Calendar,
      color: 'bg-orange-100 text-orange-600',
    },
    {
      number: '02',
      title: '参加者が最寄り駅を入力',
      description: '各参加者が日程調整に回答し、出発地点（最寄り駅）を入力します。',
      icon: MapPin,
      color: 'bg-blue-100 text-blue-600',
    },
    {
      number: '03',
      title: '最適な集合場所を自動提案',
      description: '全員の移動時間を考慮して最適な駅を導出し、周辺の飲食店を提案します。',
      icon: Utensils,
      color: 'bg-green-100 text-green-600',
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl mb-4 text-gray-900">使い方</h2>
          <p className="text-xl text-gray-600">
            3ステップで簡単にイベントを調整
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="relative">
                <div className="flex flex-col items-center text-center space-y-4">
                  {/* Icon Circle */}
                  <div className={`w-20 h-20 rounded-full ${step.color} flex items-center justify-center`}>
                    <Icon className="w-10 h-10" />
                  </div>

                  {/* Step Number */}
                  <div className="text-sm text-gray-400 tracking-widest">
                    STEP {step.number}
                  </div>

                  {/* Title */}
                  <h3 className="text-xl text-gray-900">{step.title}</h3>

                  {/* Description */}
                  <p className="text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Connecting Arrow (hidden on mobile and last item) */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-10 left-[60%] w-[80%] h-0.5 bg-gray-200">
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-gray-400 rounded-full"></div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
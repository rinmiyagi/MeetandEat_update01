import { Zap, Shield, Search, Clock } from 'lucide-react';
import { Card } from './ui/card';

export function Features() {
  const features = [
    {
      icon: Zap,
      title: 'ログイン不要',
      description: 'アカウント登録なしで、すぐにイベント作成を開始できます。',
    },
    {
      icon: Search,
      title: 'リアルタイムでお店検索',
      description: 'ホットペッパーAPIを使って、中間地点の最適なレストランを即座に検索します。',
    },
    {
      icon: Clock,
      title: '中間地点を自動計算',
      description: 'Google Routes APIで全員の位置から最適な集合場所を自動で算出します。',
    },
    {
      icon: Shield,
      title: 'プライバシー重視',
      description: '位置情報は経路計算のみに使用され、保存されることはありません。',
    },
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl mb-4 text-gray-900">ミートアンドイートの特徴</h2>
          <p className="text-xl text-gray-600">
            イベント調整をもっと簡単に、もっと便利に
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card
                key={index}
                className="p-6 border-0 shadow-sm hover:shadow-md transition-shadow duration-300 bg-white"
              >
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="w-14 h-14 rounded-lg bg-orange-50 flex items-center justify-center">
                    <Icon className="w-7 h-7 text-orange-600" />
                  </div>
                  <h3 className="text-lg text-gray-900">{feature.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Additional Info Banner */}
        <div className="mt-16 bg-orange-600 rounded-2xl p-8 text-center text-white">
          <h3 className="text-2xl mb-3">今すぐイベント調整を始めましょう</h3>
          <p className="text-orange-100 mb-6">
            位置情報と最新技術で、最適なお店選びを自動化
          </p>
          <div className="flex gap-4 justify-center text-sm flex-wrap">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <span>Google Routes API</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <span>ホットペッパーAPI</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <span>Compute Route Matrix Pro</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}